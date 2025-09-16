# Chunk

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The database id of the chunk | 
**data_id** | **String** | The id of the data the chunk belongs to | 
**hash** | **String** | The SHA-256 hash of the unencrypted chunk data base64url encoded | 
**iv** | **String** | The AES-256 initialization vector base64url encoded | 
**start** | **String** | The start of the chunk as a byte position in the file | 
**end** | **String** | The end of the chunk as a byte position in the file | 
**crc** | Option<**String**> | The CRC32 checksum of the encrypted chunk data base64url encoded | 
**created_at** | **String** | chunk creation timestamp | 
**updated_at** | **String** | chunk last update timestamp | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


