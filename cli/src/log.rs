use tracing::Level;
use tracing_subscriber::fmt::fmt;

pub fn init(verbose: u8, quiet: bool) {
    // Map verbosity to max tracing level
    let mut max_level = match verbose {
        0 => Level::INFO,
        1 => Level::DEBUG,
        _ => Level::TRACE,
    };
    if quiet {
        max_level = Level::WARN;
    }

    fmt()
        .with_max_level(max_level)
        .with_ansi(true) // enable ANSI colors
        .with_target(verbose > 0) // no target
        .without_time() // no timestamps
        .with_file(verbose > 2) // no file names
        .with_line_number(verbose > 2) // no line numbers
        .init();
}
