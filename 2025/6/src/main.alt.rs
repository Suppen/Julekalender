use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap, HashSet};

#[derive(Debug, PartialEq, Eq, Hash, Copy, Clone, PartialOrd, Ord)]
struct Coord(i8, i8);

#[derive(Debug)]
struct Grid {
    cells: Vec<Vec<char>>,
}

impl Grid {
    pub fn width(&self) -> i8 {
        self.cells[0].len() as i8
    }

    pub fn height(&self) -> i8 {
        self.cells.len() as i8
    }

    pub fn neighbours(&self, coord: Coord) -> impl Iterator<Item = Coord> {
        vec![
            Coord(coord.0, coord.1 - 1),
            Coord(coord.0, coord.1 + 1),
            Coord(coord.0 - 1, coord.1),
            Coord(coord.0 + 1, coord.1),
        ]
        .into_iter()
        .filter(|&Coord(x, y)| x >= 0 && y >= 0 && x < self.width() && y < self.height())
        .filter(|&Coord(x, y)| self.cells[y as usize][x as usize] != '#')
    }

    pub fn start_and_end_coords(&self) -> Option<(Coord, Coord)> {
        let mut s = None;
        let mut e = None;
        for (y, row) in self.cells.iter().enumerate() {
            for (x, cell) in row.iter().enumerate() {
                if *cell == 'S' {
                    s = Some(Coord(x as i8, y as i8));
                } else if *cell == '*' {
                    e = Some(Coord(x as i8, y as i8));
                }
            }
        }

        match (s, e) {
            (Some(s), Some(e)) => Some((s, e)),
            _ => None,
        }
    }

	// INFO: Function refactored by Claude to use a priority queue instead of a set
    pub fn find_shortest_path_length(&self) -> Option<i32> {
        let (start, end) = self.start_and_end_coords()?;

        let mut queue = BinaryHeap::new();
        queue.push(Reverse((0, start)));

        let mut visited = HashSet::new();
        let mut distances = HashMap::new();
        distances.insert(start, 0);

        while let Some(Reverse((current_distance, current))) = queue.pop() {
            if current == end {
                return Some(current_distance);
            }

            if !visited.insert(current) {
                continue;
            }

            let new_distance = current_distance + 1;
            for neighbour in self.neighbours(current) {
                let is_shorter = distances.get(&neighbour).is_none_or(|&d| new_distance < d);

                if is_shorter {
                    distances.insert(neighbour, new_distance);
                    queue.push(Reverse((new_distance, neighbour)));
                }
            }
        }

        None
    }
}

fn main() {
    let precision_level: i32 = std::fs::read_to_string("perfeksjonsruten.txt")
        .unwrap()
        .split(";")
        .map(|p| {
            p.lines()
                .filter(|l| !l.is_empty())
                .map(|l| l.chars().collect::<Vec<_>>())
                .collect::<Vec<_>>()
        })
        .map(|cells| Grid { cells })
        .map(|grid| grid.find_shortest_path_length().unwrap_or(0))
        .sum();

    println!("{precision_level}");
}
