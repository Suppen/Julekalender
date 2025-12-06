use std::collections::{HashMap, HashSet};

#[derive(Debug, PartialEq, Eq, Hash, Copy, Clone)]
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

    pub fn find_shortest_path_length(&self) -> Option<i32> {
        let (start, end) = self.start_and_end_coords()?;

        let mut unvisited = (0..self.height())
            .flat_map(move |y| (0..self.width()).map(move |x| Coord(x, y)))
            .filter(|&Coord(x, y)| self.cells[y as usize][x as usize] != '#')
            .collect::<HashSet<_>>();

        let mut distances = HashMap::new();
        distances.insert(start, 0);

        loop {
            let (current, current_distance) = unvisited
                .iter()
                .filter_map(|&c| distances.get(&c).map(|&dist| (c, dist)))
                .min_by(|(_, a), (_, b)| a.cmp(b))?;

            if current == end {
                return Some(current_distance);
            }
            if current_distance == i32::MAX {
                return None;
            }

            let new_distance = current_distance + 1;

            let unvisited_neighbours = self.neighbours(current).filter(|c| unvisited.contains(c));

            for neighbour in unvisited_neighbours {
                distances
                    .entry(neighbour)
                    .and_modify(|d| *d = std::cmp::min(*d, new_distance))
                    .or_insert(new_distance);
            }

            unvisited.remove(&current);
        }
    }
}

fn main() {
    let precision_level: i32 = std::fs::read_to_string("perfeksjonsruten.txt")
        .unwrap()
        .split("\n;\n")
        .map(|p| {
            p.lines()
                .map(|l| l.chars().collect::<Vec<_>>())
                .collect::<Vec<_>>()
        })
        .map(|cells| Grid { cells })
        .map(|grid| grid.find_shortest_path_length().unwrap_or(0))
        .sum();

    println!("{precision_level}");
}
