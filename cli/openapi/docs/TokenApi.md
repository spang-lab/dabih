# \TokenApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**add_token**](TokenApi.md#add_token) | **POST** /token/add | 
[**list_tokens**](TokenApi.md#list_tokens) | **GET** /token/list | 
[**remove_token**](TokenApi.md#remove_token) | **POST** /token/remove | 



## add_token

> models::TokenResponse add_token(token_add_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**token_add_body** | [**TokenAddBody**](TokenAddBody.md) |  | [required] |

### Return type

[**models::TokenResponse**](TokenResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_tokens

> Vec<models::TokenResponse> list_tokens()


### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::TokenResponse>**](TokenResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## remove_token

> remove_token(remove_token_request)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**remove_token_request** | [**RemoveTokenRequest**](RemoveTokenRequest.md) |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

