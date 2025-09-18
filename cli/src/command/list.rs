use crate::api::InodeType;
use crate::config::Context;
use crate::error::Result;
use clap::Args;
use openapi::models::InodeMembers;
use tracing::warn;

#[derive(Args, Debug)]
pub struct List {
    /// List files in the given path
    #[clap(default_value = ".")]
    pub path: String,

    /// Output in JSON format
    #[arg(short, long)]
    json: bool,
}

fn is_listable(inode_type: u32) -> bool {
    let t = InodeType::from_u32(inode_type).unwrap();
    if t == InodeType::File {
        return false;
    }
    if t == InodeType::Upload {
        return false;
    }
    true
}
fn get_size(inode: &InodeMembers) -> Option<u64> {
    if let Some(data) = &inode.data {
        if let Some(file_data) = data {
            match file_data.size.parse::<u64>() {
                Ok(size) => return Some(size),
                Err(_) => return None,
            }
        }
    }
    None
}

fn size_to_human_readable(size: Option<u64>) -> String {
    if size.is_none() {
        return "   -   ".to_string();
    }
    const UNITS: [&str; 5] = ["B", "K", "M", "G", "T"];
    let mut size = size.unwrap() as f64;
    let mut unit = 0;
    while size >= 1024.0 && unit < UNITS.len() - 1 {
        size /= 1024.0;
        unit += 1;
    }
    format!("{:7.2} {}", size, UNITS[unit])
}

pub async fn run(ctx: Context, args: List) -> Result<()> {
    let inode = match ctx.api_().fs().resolve_path(&args.path).await? {
        Some(inode) => inode,
        None => {
            warn!("Path not found: {}", args.path);
            return Ok(());
        }
    };

    if !is_listable(inode.r#type) {
        warn!("Path is not a directory: {}", args.path);
        return Ok(());
    }
    let resp = ctx.api_().fs().list(&inode.mnemonic).await?;
    if args.json {
        println!("{}", serde_json::to_string_pretty(&resp)?);
    } else {
        for entry in resp.children.iter() {
            let t = InodeType::from_u32(entry.r#type)?;
            let s = get_size(&entry);
            println!(
                "{} {}\t{:20}\t{}",
                t.as_char(),
                size_to_human_readable(s),
                entry.mnemonic,
                entry.name,
            );
        }
    }

    Ok(())
}
