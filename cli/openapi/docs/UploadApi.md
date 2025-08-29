# \UploadApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel_upload**](UploadApi.md#cancel_upload) | **POST** /upload/{mnemonic}/cancel | 
[**chunk_upload**](UploadApi.md#chunk_upload) | **PUT** /upload/{mnemonic}/chunk | 
[**finish_upload**](UploadApi.md#finish_upload) | **POST** /upload/{mnemonic}/finish | 
[**start_upload**](UploadApi.md#start_upload) | **POST** /upload/start | 
[**unfinished_uploads**](UploadApi.md#unfinished_uploads) | **GET** /upload/unfinished | 



## cancel_upload

> cancel_upload(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## chunk_upload

> models::Chunk chunk_upload(mnemonic, content_range, digest, chunk)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |
**content_range** | **String** | The range of bytes in the chunk It should be in the format `bytes {start}-{end}/{size?}` | [required] |
**digest** | **String** | The SHA-256 hash of the chunk data encoded in base64url It should be in the format `sha-256={hash}` | [required] |
**chunk** | Option<**std::path::PathBuf**> |  |  |

### Return type

[**models::Chunk**](Chunk.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## finish_upload

> models::File finish_upload(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**models::File**](File.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## start_upload

> models::File start_upload(upload_start_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**upload_start_body** | [**UploadStartBody**](UploadStartBody.md) |  | [required] |

### Return type

[**models::File**](File.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## unfinished_uploads

> Vec<models::FileUpload> unfinished_uploads()


### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::FileUpload>**](FileUpload.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

