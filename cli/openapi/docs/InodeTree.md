# InodeTree

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | Option<[**serde_json::Value**](.md)> | The database id of the inode | 
**mnemonic** | **String** |  | 
**r#type** | **f64** |  | 
**name** | **String** |  | 
**tag** | Option<**String**> |  | 
**data** | Option<[**models::FileData**](FileData.md)> |  | [optional]
**parent_id** | Option<[**serde_json::Value**](.md)> |  | 
**created_at** | **String** |  | 
**updated_at** | **String** |  | 
**members** | [**Vec<models::Member>**](Member.md) |  | 
**keys** | [**Vec<models::Key>**](Key.md) |  | 
**children** | Option<[**Vec<models::InodeTree>**](InodeTree.md)> |  | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


