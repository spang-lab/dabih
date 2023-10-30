use std::io::Stdout;

pub struct ProgressBar {
    inner: pbr::ProgressBar<Stdout>,
}

pub trait Progress {
    fn add(&mut self, amount: u64) -> u64;
    fn set(&mut self, position: u64) -> u64;
    fn set_total(&mut self, total: u64);
    fn message(&mut self, message: &str);
    fn finish(&mut self);
}

impl ProgressBar {
    pub fn new(total: u64) -> Self {
        let mut pb = pbr::ProgressBar::new(total);

        pb.set_units(pbr::Units::Bytes);
        ProgressBar {
            inner: pbr::ProgressBar::new(total),
        }
    }
}

impl Progress for ProgressBar {
    fn set_total(&mut self, total: u64) {
        let mut pb = pbr::ProgressBar::new(total);
        pb.set_units(pbr::Units::Bytes);
        self.inner = pb;
    }
    fn add(&mut self, amount: u64) -> u64 {
        self.inner.add(amount)
    }
    fn finish(&mut self) {
        self.inner.finish()
    }
    fn set(&mut self, position: u64) -> u64 {
        self.inner.set(position)
    }
    fn message(&mut self, message: &str) {
        self.inner.message(message)
    }
}
