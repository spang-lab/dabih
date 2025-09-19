use openapiv3::{OpenAPI, ReferenceOr};
use std::path::PathBuf;

// remove multipart/form-data from  put "/upload/{mnemonic}/chunk" requestBody
// because progenitor does not support it yet
fn remove_multipart_form_data(spec: &mut OpenAPI) {
    if let Some(path_item) = spec.paths.paths.get_mut("/upload/{mnemonic}/chunk") {
        if let ReferenceOr::Item(item) = path_item {
            if let Some(put_op) = &mut item.put {
                if let Some(request_body) = &mut put_op.request_body {
                    if let ReferenceOr::Item(rb) = request_body {
                        rb.content.swap_remove("multipart/form-data");
                    }
                }
            }
        }
    }
}

fn main() {
    let src = "../api/build/spec.json";
    println!("cargo:rerun-if-changed={}", src);
    let file = std::fs::File::open(src).unwrap();
    let mut spec = serde_json::from_reader(file).unwrap();
    remove_multipart_form_data(&mut spec);

    let mut generator = progenitor::Generator::default();

    let tokens = generator.generate_tokens(&spec).unwrap();
    let ast = syn::parse2(tokens).unwrap();
    let content = prettyplease::unparse(&ast);

    let mut out_file = std::path::Path::new(&std::env::var("OUT_DIR").unwrap()).to_path_buf();
    out_file.push("codegen.rs");

    let tmp_out_path = PathBuf::from("./codegen.rs");

    std::fs::write(tmp_out_path, &content).unwrap();
    std::fs::write(out_file, content).unwrap();
}
