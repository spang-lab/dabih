# FileKeys

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The database id of the inode | 
**mnemonic** | **String** | mnemonics are human readable unique identifiers for datasets mnemonics have the form <random adjective>_<random first name> | 
**r#type** | **u32** | The type of the inode | 
**name** | **String** |  | 
**tag** | Option<**String**> |  | 
**data_id** | **String** | The database id file data if the inode is a file | 
**data** | [**models::FileData**](FileData.md) |  | 
**parent_id** | Option<[**serde_json::Value**](.md)> |  | 
**created_at** | **String** |  | 
**updated_at** | **String** |  | 
**keys** | [**Vec<models::Key>**](Key.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


