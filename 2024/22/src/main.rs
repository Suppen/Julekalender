use rayon::prelude::*;
use std::collections::HashMap;
use std::collections::HashSet;
use std::fs;

#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash)]
struct Coord(usize, usize);

#[derive(Debug, PartialEq, Eq, Clone, Hash)]
struct Board {
    cells: Vec<Vec<u8>>,
    width: usize,
    height: usize,
}

impl Board {
    const EMPTY_CELL_CHAR: u8 = u8::MAX;

    pub fn new(cells: Vec<Vec<u8>>) -> Self {
        Self {
            width: cells.iter().map(|row| row.len()).max().unwrap(),
            height: cells.len(),
            cells,
        }
    }

    pub fn from_lines(lines: &[String]) -> Self {
        let num_rows = lines.len();

        let chars = lines
            .iter()
            .flat_map(|l| l.chars())
            .collect::<HashSet<char>>()
            .into_iter()
            .enumerate()
            .map(|(i, c)| (c, i as u8))
            .collect::<HashMap<char, u8>>();

        let mut cells: Vec<Vec<u8>> = vec![vec![Board::EMPTY_CELL_CHAR; num_rows]; num_rows];

        for (y, line) in lines.iter().rev().enumerate() {
            for (x, ch) in line.chars().enumerate() {
                cells[x][y] = *chars.get(&ch).unwrap();
            }
        }

        Board::new(cells)
    }

    pub fn get_cell_value(&self, Coord(x, y): Coord) -> Option<&u8> {
        self.cells.get(x)?.get(y)
    }

    pub fn set_cell_value(&mut self, Coord(x, y): Coord, value: u8) {
        if (x, y) < (self.width, self.height) {
            self.cells[x][y] = value;
        }
    }

    pub fn clear_cell(&mut self, c: Coord) {
        self.set_cell_value(c, Board::EMPTY_CELL_CHAR)
    }

    pub fn clear_group(&mut self, group: &HashSet<Coord>) {
        group.iter().for_each(|c| self.clear_cell(*c))
    }

    pub fn remove_cleared_cells(&mut self) {
        for x in 0..self.width {
            self.cells[x].retain(|c| *c != Board::EMPTY_CELL_CHAR);
        }
    }

    pub fn is_cleared(&self) -> bool {
        self.cells.iter().all(|col| col.is_empty())
    }

    pub fn get_neighbors(&self, c: Coord) -> Vec<Coord> {
        let Coord(cx, cy) = c;

        let mut neighbors = Vec::new();
        if cx > 0 {
            neighbors.push(Coord(cx - 1, cy));
        }
        if cx < self.width - 1 {
            neighbors.push(Coord(cx + 1, cy));
        }
        if cy > 0 {
            neighbors.push(Coord(cx, cy - 1));
        }
        if cy < self.height - 1 {
            neighbors.push(Coord(cx, cy + 1));
        }

        neighbors
    }

    fn groups(&self, neighbors: &HashMap<Coord, Vec<Coord>>) -> Vec<HashSet<Coord>> {
        let mut groups: Vec<HashSet<Coord>> = Vec::new();
        let mut visited = vec![vec![false; self.height]; self.width];

        (0..self.width).for_each(|x| {
            (0..self.height).for_each(|y| {
                if visited[x][y] {
                    return;
                }
                if self.get_cell_value(Coord(x, y)).is_none() {
                    return;
                }

                let mut group = HashSet::new();
                let cell_value = self.get_cell_value(Coord(x, y));

                let mut queue = Vec::new();
                queue.push(Coord(x, y));

                while let Some(c) = queue.pop() {
                    group.insert(c);
                    let Coord(cx, cy) = c;
                    visited[cx][cy] = true;

                    for n in neighbors.get(&c).unwrap().iter() {
                        if self.get_cell_value(*n) == cell_value && !group.contains(n) {
                            queue.push(*n);
                        }
                    }
                }

                groups.push(group);
            });
        });

        groups
    }
}

fn parse_boards(content: &str) -> Vec<Board> {
    let lines: Vec<String> = content.lines().map(|s| s.to_string()).collect();
    let empty_line_indices: Vec<usize> = lines
        .iter()
        .enumerate()
        .filter(|(_, l)| l.is_empty())
        .map(|(i, _)| i)
        .collect();

    let mut boards = Vec::new();
    let mut start = 0;

    for &end in empty_line_indices
        .iter()
        .chain(std::iter::once(&lines.len()))
    {
        let board_lines = &lines[start..end];
        if !board_lines.is_empty() {
            boards.push(Board::from_lines(board_lines));
        }
        start = end + 1;
    }

    boards
}

fn solve(board: Board) -> usize {
    let mut neighbors = HashMap::new();

    for x in 0..board.width {
        for y in 0..board.height {
            let c = Coord(x, y);
            neighbors.insert(c, board.get_neighbors(c));
        }
    }

    let mut checked = HashMap::new();

    fn recursive_solve(
        board: Board,
        neighbors: &HashMap<Coord, Vec<Coord>>,
        checked: &mut HashMap<Board, usize>,
    ) -> usize {
        if board.is_cleared() {
            return 0;
        }
        if let Some(already_computed) = checked.get(&board) {
            return *already_computed;
        }

        let groups = board.groups(neighbors);

        let mut best = usize::MAX;
        for group in groups {
            let mut clone = board.clone();
            clone.clear_group(&group);
            clone.remove_cleared_cells();

            let cost = 1 + recursive_solve(clone.clone(), neighbors, checked);
            best = best.min(cost);
        }

        checked.insert(board, best);

        best
    }

    recursive_solve(board, &neighbors, &mut checked)
}

fn main() {
    let content = fs::read_to_string("./stekebrett.txt").expect("Failed to read file");
    let boards = parse_boards(&content);
    let total_moves: usize = boards
        .into_par_iter()
        .enumerate()
        .map(|(i, board)| {
            let depth = solve(board);

            println!("Board {} solved in {} moves", i, depth);

            depth
        })
        .sum();

    println!("{}", total_moves);
}
