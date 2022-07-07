use std::ptr;

struct Coordinate {
    x: i32,
    y: i32,
    z: i32,
}

fn distance(a: &Coordinate, b: &Coordinate) -> f64 {
    println!(
        "The location of A is {:?} and of B is {:?}",
        ptr::addr_of!(*a),
        ptr::addr_of!(*b)
    );
    f64::from((a.x - b.x).pow(2) + (a.y - b.y).pow(2) + (a.z - b.z).pow(2)).sqrt()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn three_d_distance() {
        let a = Coordinate { x: 0, y: 0, z: 0 };
        let b = Coordinate { x: 1, y: 1, z: 1 };
        assert_eq!(distance(&a, &b), f64::from(3).sqrt());
    }
}

fn main() {
    let a = Coordinate { x: 0, y: 0, z: 0 };
    let b = Coordinate { x: 1, y: 1, z: 1 };
    println!(
        "The distance between those two points is {}",
        distance(&a, &b),
    );
}
