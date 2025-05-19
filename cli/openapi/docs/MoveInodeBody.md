# MoveInodeBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mnemonic** | **String** | mnemonics are human readable unique identifiers for datasets mnemonics have the form <random adjective>_<random first name> | 
**parent** | Option<**String**> | Optional: The mnemonic of the new parent directory | [optional]
**keys** | Option<[**Vec<models::FileDecryptionKey>**](FileDecryptionKey.md)> | The list of AES-256 keys required to decrypt all child datasets | [optional]
**name** | Option<**String**> | Optional: The new name of the inode | [optional]
**tag** | Option<**String**> | Optional: The new tag of the inode | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


