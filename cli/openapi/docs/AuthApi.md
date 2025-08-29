# \AuthApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**auth_info**](AuthApi.md#auth_info) | **GET** /auth/info | 
[**refresh_token**](AuthApi.md#refresh_token) | **POST** /auth/refresh | 
[**sign_in**](AuthApi.md#sign_in) | **POST** /auth/signIn | 
[**verify_email**](AuthApi.md#verify_email) | **POST** /auth/verify | 



## auth_info

> models::User auth_info()


### Parameters

This endpoint does not need any parameter.

### Return type

[**models::User**](User.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## refresh_token

> String refresh_token()


### Parameters

This endpoint does not need any parameter.

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## sign_in

> models::SignInResponse sign_in(sign_in_request)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**sign_in_request** | [**SignInRequest**](SignInRequest.md) |  | [required] |

### Return type

[**models::SignInResponse**](SignInResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## verify_email

> String verify_email(verify_email_request)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**verify_email_request** | [**VerifyEmailRequest**](VerifyEmailRequest.md) |  | [required] |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

