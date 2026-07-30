import copy
import random
from typing import Optional, List, Dict, Tuple, Set


DEFAULT_INITIAL_STACKS = [["A", "B"], ["C"], ["D"]]
DEFAULT_GOAL_STACKS = [["D", "C", "B", "A"]]


def is_state_equal(stacks1: List[List[str]], stacks2: List[List[str]]) -> bool:
    """
    Compare two block stack configurations (order of non-empty stacks doesn't matter).
    """
    clean1 = sorted([stack for stack in stacks1 if stack])
    clean2 = sorted([stack for stack in stacks2 if stack])
    return clean1 == clean2


def state_to_predicates(stacks: List[List[str]], holding: Optional[str] = None) -> Set[str]:
    """
    Convert a stack state + holding status into a set of STRIPS predicates.
    Predicates:
    - ONTABLE(X)
    - ON(X, Y)
    - CLEAR(X)
    - HOLDING(X)
    - ARMEMPTY
    """
    predicates = set()
    if holding is None:
        predicates.add("ARMEMPTY")
    else:
        predicates.add(f"HOLDING({holding})")

    for stack in stacks:
        if not stack:
            continue
        predicates.add(f"ONTABLE({stack[0]})")
        for i in range(len(stack) - 1):
            predicates.add(f"ON({stack[i+1]}, {stack[i]})")
        predicates.add(f"CLEAR({stack[-1]})")

    return predicates


def create_game(initial_stacks=None, goal_stacks=None) -> dict:
    """
    Create a new Block World game state.
    """
    if initial_stacks is None:
        initial_stacks = copy.deepcopy(DEFAULT_INITIAL_STACKS)
    if goal_stacks is None:
        goal_stacks = copy.deepcopy(DEFAULT_GOAL_STACKS)

    # Ensure clean empty stacks are removed
    initial_clean = [list(s) for s in initial_stacks if s]
    goal_clean = [list(s) for s in goal_stacks if s]

    return {
        "stacks": initial_clean,
        "holding": None,
        "initial_stacks": copy.deepcopy(initial_clean),
        "goal_stacks": goal_clean,
        "moves_count": 0,
        "is_solved": is_state_equal(initial_clean, goal_clean),
    }


def reset_game(game: dict) -> dict:
    """
    Reset game back to its initial stacks.
    """
    initial = copy.deepcopy(game["initial_stacks"])
    game["stacks"] = initial
    game["holding"] = None
    game["moves_count"] = 0
    game["is_solved"] = is_state_equal(initial, game["goal_stacks"])
    return game


def generate_random_problem(num_blocks: int = 4) -> dict:
    """
    Generate a new random solvable initial and goal configuration.
    """
    block_names = [chr(65 + i) for i in range(num_blocks)]  # ['A', 'B', 'C', 'D']

    def random_stacks(blocks: List[str]) -> List[List[str]]:
        shuffled = list(blocks)
        random.shuffle(shuffled)
        num_stacks = random.randint(2, min(len(blocks), 3))
        stacks = [[] for _ in range(num_stacks)]
        for b in shuffled:
            chosen = random.randint(0, num_stacks - 1)
            stacks[chosen].append(b)
        return [s for s in stacks if s]

    initial = random_stacks(block_names)
    goal = random_stacks(block_names)

    # Ensure goal is not identical to initial
    attempts = 0
    while is_state_equal(initial, goal) and attempts < 10:
        goal = random_stacks(block_names)
        attempts += 1

    return create_game(initial, goal)


def move_block(game: dict, action: str, block: str, target: Optional[str] = None) -> dict:
    """
    Execute a manual move according to Blocks World rules.
    Actions:
    - "pickup": Pick up block from table (must be CLEAR, ARMEMPTY, ONTABLE).
    - "unstack": Pick up block from on top of another block.
    - "putdown": Put held block onto table.
    - "stack": Stack held block onto target block (target must be CLEAR).
    """
    stacks = game.get("stacks", [])
    holding = game.get("holding")

    if game.get("is_solved", False):
        return game

    moves_count = game.get("moves_count", 0)

    if action == "pickup":
        if holding is not None:
            raise ValueError("Arm is not empty")
        # Find block stack
        for s_idx, stack in enumerate(stacks):
            if stack and stack[-1] == block and len(stack) == 1:
                game["holding"] = stack.pop()
                if not stack:
                    stacks.pop(s_idx)
                moves_count += 1
                break
        else:
            raise ValueError(f"Cannot pickup {block}")

    elif action == "unstack":
        if holding is not None:
            raise ValueError("Arm is not empty")
        for s_idx, stack in enumerate(stacks):
            if len(stack) >= 2 and stack[-1] == block:
                if target and stack[-2] != target:
                    continue
                game["holding"] = stack.pop()
                moves_count += 1
                break
        else:
            raise ValueError(f"Cannot unstack {block}")

    elif action == "putdown":
        if holding is None or holding != block:
            raise ValueError(f"Not holding {block}")
        stacks.append([block])
        game["holding"] = None
        moves_count += 1

    elif action == "stack":
        if holding is None or holding != block:
            raise ValueError(f"Not holding {block}")
        if not target:
            raise ValueError("Target block required for stack action")
        for stack in stacks:
            if stack and stack[-1] == target:
                stack.append(block)
                game["holding"] = None
                moves_count += 1
                break
        else:
            raise ValueError(f"Cannot stack on top of {target}")

    game["stacks"] = [s for s in stacks if s]
    game["moves_count"] = moves_count

    if "goal_stacks" in game:
        game["is_solved"] = (game["holding"] is None) and is_state_equal(game["stacks"], game["goal_stacks"])
    else:
        game["is_solved"] = False
    return game


def goal_stack_planning(initial_stacks: List[List[str]], goal_stacks: List[List[str]]) -> Tuple[List[str], List[dict], List[str]]:
    """
    Goal Stack Planning (GSP) algorithm for Blocks World.
    Returns:
    - moves: List of action descriptions e.g. ["UNSTACK(B, A)", "PUTDOWN(B)", ...]
    - solution_states: List of state dictionaries representing each step.
    - explanation: List of explanatory text steps for the Goal Stack planner execution.
    """
    current_stacks = [list(s) for s in initial_stacks if s]
    current_holding = None
    current_state = {
        "stacks": copy.deepcopy(current_stacks),
        "holding": current_holding,
        "goal_stacks": copy.deepcopy(goal_stacks),
        "moves_count": 0,
        "is_solved": is_state_equal(current_stacks, goal_stacks),
    }

    if is_state_equal(current_stacks, goal_stacks):
        return [], [copy.deepcopy(current_state)], ["Initial state is already at goal configuration."]

    solution_states = [copy.deepcopy(current_state)]
    moves = []
    explanation = []

    # Target goal predicates
    goal_predicates = state_to_predicates(goal_stacks, None)

    # Goal stack
    stack = []
    # Push compound goal
    stack.append(goal_predicates)
    # Push individual goals
    for gp in sorted(list(goal_predicates)):
        stack.append(gp)

    explanation.append(f"Initialized Goal Stack with {len(goal_predicates)} target goals.")

    max_steps = 100
    step_count = 0

    while stack and step_count < max_steps:
        top = stack.pop()
        current_predicates = state_to_predicates(current_state["stacks"], current_state["holding"])

        if isinstance(top, set):
            # Compound goal
            if top.issubset(current_predicates):
                continue
            else:
                stack.append(top)
                unsatisfied = top - current_predicates
                for pred in sorted(list(unsatisfied)):
                    stack.append(pred)

        elif isinstance(top, str):
            if top in current_predicates:
                continue

            # It's an operator or an unsatisfied predicate
            if top.startswith("ACTION:"):
                action_name = top.replace("ACTION:", "")
                parts = action_name.split()
                act_type = parts[0]

                try:
                    if act_type == "PICKUP":
                        b = parts[1]
                        move_block(current_state, "pickup", b)
                        msg = f"Pick up block {b} from Table"
                    elif act_type == "UNSTACK":
                        b, target_b = parts[1], parts[2]
                        move_block(current_state, "unstack", b, target_b)
                        msg = f"Unstack block {b} from {target_b}"
                    elif act_type == "PUTDOWN":
                        b = parts[1]
                        move_block(current_state, "putdown", b)
                        msg = f"Put down block {b} on Table"
                    elif act_type == "STACK":
                        b, target_b = parts[1], parts[2]
                        move_block(current_state, "stack", b, target_b)
                        msg = f"Stack block {b} on top of {target_b}"
                    else:
                        continue
                except Exception:
                    # If GSP encounters an invalid move transition, fallback to BFS planner
                    return bfs_state_planner(initial_stacks, goal_stacks)

                moves.append(msg)
                solution_states.append(copy.deepcopy(current_state))
                explanation.append(f"Applied action: {msg}")
                step_count += 1

            else:
                # Goal predicate to satisfy
                pred = top
                explanation.append(f"Goal to satisfy: {pred}")

                if pred.startswith("ON("):
                    # ON(X, Y) -> achieved by STACK(X, Y)
                    content = pred[3:-1]
                    x, y = [s.strip() for s in content.split(",")]
                    op = f"ACTION:STACK {x} {y}"
                    preconds = {f"HOLDING({x})", f"CLEAR({y})"}
                    stack.append(op)
                    stack.append(preconds)
                    for p in sorted(list(preconds)):
                        stack.append(p)

                elif pred.startswith("ONTABLE("):
                    # ONTABLE(X) -> achieved by PUTDOWN(X)
                    x = pred[8:-1]
                    op = f"ACTION:PUTDOWN {x}"
                    preconds = {f"HOLDING({x})"}
                    stack.append(op)
                    stack.append(preconds)
                    for p in sorted(list(preconds)):
                        stack.append(p)

                elif pred.startswith("HOLDING("):
                    # HOLDING(X) -> achieved by PICKUP(X) if ONTABLE(X), or UNSTACK(X, Y) if ON(X, Y)
                    x = pred[8:-1]
                    # Find where X is in current state
                    is_on_table = False
                    on_block = None
                    for st in current_state["stacks"]:
                        if st:
                            if st[0] == x and len(st) == 1:
                                is_on_table = True
                            elif x in st and st.index(x) > 0:
                                idx = st.index(x)
                                on_block = st[idx - 1]

                    if is_on_table:
                        op = f"ACTION:PICKUP {x}"
                        preconds = {f"ONTABLE({x})", f"CLEAR({x})", "ARMEMPTY"}
                    elif on_block:
                        op = f"ACTION:UNSTACK {x} {on_block}"
                        preconds = {f"ON({x}, {on_block})", f"CLEAR({x})", "ARMEMPTY"}
                    else:
                        # Fallback pickup
                        op = f"ACTION:PICKUP {x}"
                        preconds = {f"ONTABLE({x})", f"CLEAR({x})", "ARMEMPTY"}

                    stack.append(op)
                    stack.append(preconds)
                    for p in sorted(list(preconds)):
                        stack.append(p)

                elif pred.startswith("CLEAR("):
                    # CLEAR(X) -> if Y is on X, achieved by UNSTACK(Y, X)
                    x = pred[6:-1]
                    # Find what block is on X
                    above_block = None
                    for st in current_state["stacks"]:
                        if x in st and st.index(x) < len(st) - 1:
                            above_block = st[st.index(x) + 1]

                    if above_block:
                        op = f"ACTION:UNSTACK {above_block} {x}"
                        preconds = {f"ON({above_block}, {x})", f"CLEAR({above_block})", "ARMEMPTY"}
                        stack.append(op)
                        stack.append(preconds)
                        for p in sorted(list(preconds)):
                            stack.append(p)

                elif pred == "ARMEMPTY":
                    # ARMEMPTY -> if holding X, achieved by PUTDOWN(X)
                    if current_state["holding"]:
                        h = current_state["holding"]
                        op = f"ACTION:PUTDOWN {h}"
                        preconds = {f"HOLDING({h})"}
                        stack.append(op)
                        stack.append(preconds)
                        for p in sorted(list(preconds)):
                            stack.append(p)

    # Fallback to BFS state-space planner if GSP didn't reach exact goal or produced no moves
    if not is_state_equal(current_state["stacks"], goal_stacks):
        return bfs_state_planner(initial_stacks, goal_stacks)

    return moves, solution_states, explanation


def bfs_state_planner(initial_stacks: List[List[str]], goal_stacks: List[List[str]]) -> Tuple[List[str], List[dict], List[str]]:
    """
    Optimal BFS State-Space planner fallback.
    Guarantees shortest solution path if GSP encounters Sussman conflicts.
    """
    from collections import deque

    def encode(stacks, holding):
        st_tuple = tuple(tuple(s) for s in sorted(stacks))
        return (st_tuple, holding)

    start_stacks = [list(s) for s in initial_stacks if s]
    start_node = (start_stacks, None)
    initial_dict = {
        "stacks": copy.deepcopy(start_stacks),
        "holding": None,
        "goal_stacks": copy.deepcopy(goal_stacks),
        "moves_count": 0,
        "is_solved": is_state_equal(start_stacks, goal_stacks),
    }
    queue = deque([(start_node, [], [initial_dict])])
    visited = {encode(start_stacks, None)}

    while queue:
        (curr_stacks, curr_holding), path_moves, path_states = queue.popleft()

        if curr_holding is None and is_state_equal(curr_stacks, goal_stacks):
            explanation = [f"BFS Goal Stack Solution found in {len(path_moves)} steps."]
            return path_moves, path_states, explanation

        # Generate legal moves
        if curr_holding is None:
            # Pick up or unstack clear blocks
            for s_idx, st in enumerate(curr_stacks):
                if not st:
                    continue
                top = st[-1]
                # Try pickup (if len == 1) or unstack (if len > 1)
                new_stacks = [list(s) for s in curr_stacks]
                new_stacks[s_idx].pop()
                new_stacks = [s for s in new_stacks if s]

                if len(st) == 1:
                    move_desc = f"Pick up block {top} from Table"
                else:
                    under = st[-2]
                    move_desc = f"Unstack block {top} from {under}"

                enc = encode(new_stacks, top)
                if enc not in visited:
                    visited.add(enc)
                    next_state_dict = {
                        "stacks": copy.deepcopy(new_stacks),
                        "holding": top,
                        "goal_stacks": copy.deepcopy(goal_stacks),
                        "moves_count": len(path_moves) + 1,
                        "is_solved": False,
                    }
                    queue.append(((new_stacks, top), path_moves + [move_desc], path_states + [next_state_dict]))

        else:
            # Holding a block -> can putdown on table or stack on any clear block
            b = curr_holding
            # Option 1: Put down on table
            new_stacks_td = [list(s) for s in curr_stacks] + [[b]]
            move_td = f"Put down block {b} on Table"
            enc_td = encode(new_stacks_td, None)
            if enc_td not in visited:
                visited.add(enc_td)
                next_state_dict = {
                    "stacks": copy.deepcopy(new_stacks_td),
                    "holding": None,
                    "goal_stacks": copy.deepcopy(goal_stacks),
                    "moves_count": len(path_moves) + 1,
                    "is_solved": is_state_equal(new_stacks_td, goal_stacks),
                }
                queue.append(((new_stacks_td, None), path_moves + [move_td], path_states + [next_state_dict]))

            # Option 2: Stack on top of an existing stack
            for s_idx, st in enumerate(curr_stacks):
                if not st:
                    continue
                target_top = st[-1]
                new_stacks_st = [list(s) for s in curr_stacks]
                new_stacks_st[s_idx].append(b)
                move_st = f"Stack block {b} on top of {target_top}"
                enc_st = encode(new_stacks_st, None)
                if enc_st not in visited:
                    visited.add(enc_st)
                    next_state_dict = {
                        "stacks": copy.deepcopy(new_stacks_st),
                        "holding": None,
                        "goal_stacks": copy.deepcopy(goal_stacks),
                        "moves_count": len(path_moves) + 1,
                        "is_solved": is_state_equal(new_stacks_st, goal_stacks),
                    }
                    queue.append(((new_stacks_st, None), path_moves + [move_st], path_states + [next_state_dict]))

    return [], [{"stacks": initial_stacks, "holding": None}], ["No solution path exists."]
