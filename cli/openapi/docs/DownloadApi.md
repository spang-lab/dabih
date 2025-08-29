# \DownloadApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**decrypt_dataset**](DownloadApi.md#decrypt_dataset) | **POST** /download/{mnemonic}/decrypt | 
[**download_chunk**](DownloadApi.md#download_chunk) | **GET** /download/{uid}/chunk/{hash} | 
[**download_dataset**](DownloadApi.md#download_dataset) | **GET** /download | 



## decrypt_dataset

> models::TokenResponse decrypt_dataset(mnemonic, decrypt_dataset_request)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |
**decrypt_dataset_request** | [**DecryptDatasetRequest**](DecryptDatasetRequest.md) |  | [required] |

### Return type

[**models::TokenResponse**](TokenResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## download_chunk

> String download_chunk(uid, hash)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**uid** | **String** |  | [required] |
**hash** | **String** |  | [required] |

### Return type

**String**

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/octet-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## download_dataset

> String download_dataset()


### Parameters

This endpoint does not need any parameter.

### Return type

**String**

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

