use anyhow::{bail, Result};
use glob::glob;
use std::path::PathBuf;

fn expand_dir(path: PathBuf) -> Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    let glob_string = path.join("**/*");
    for entry in glob(&glob_string.to_string_lossy())? {
        let path = entry?;
        if path.is_file() {
            files.push(path);
        }
    }
    Ok(files)
}

pub fn resolve(paths: Vec<String>, recursive: bool, zip: bool, limit: i64) -> Result<Vec<PathBuf>> {
    if recursive && zip {
        bail!("The options --recursive and --zip are exclusive and cannot be used together. Aborting.")
    }
    let mut entries: Vec<PathBuf> = Vec::new();
    for path in paths {
        for entry in glob(&path)? {
            let path: PathBuf = entry?;
            if path.is_file() {
                entries.push(path);
            } else if path.is_dir() && recursive {
                let mut files = expand_dir(path)?;
                entries.append(&mut files);
            } else if path.is_dir() && zip {
                entries.push(path);
            } else {
                bail!("Could not handle path {}, set either the --recursive or --zip flag for folders", path.display());
            }

            if limit > 0 && entries.len() >= limit as usize {
                bail!("Found more than {} files. Aborting. \nUse the option -l to set a different limit.", limit);
            }
        }
    }
    Ok(entries)
}
