# \UserApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**add_key**](UserApi.md#add_key) | **POST** /user/key/add | 
[**add_user**](UserApi.md#add_user) | **POST** /user/add | 
[**enable_key**](UserApi.md#enable_key) | **POST** /user/key/enable | 
[**find_user**](UserApi.md#find_user) | **POST** /user/find | 
[**list_users**](UserApi.md#list_users) | **GET** /user/list | 
[**me**](UserApi.md#me) | **GET** /user/me | 
[**remove_key**](UserApi.md#remove_key) | **POST** /user/key/remove | 
[**remove_user**](UserApi.md#remove_user) | **POST** /user/remove | 



## add_key

> models::PublicKey add_key(key_add_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**key_add_body** | [**KeyAddBody**](KeyAddBody.md) |  | [required] |

### Return type

[**models::PublicKey**](PublicKey.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## add_user

> models::UserResponse add_user(user_add_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**user_add_body** | [**UserAddBody**](UserAddBody.md) |  | [required] |

### Return type

[**models::UserResponse**](UserResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## enable_key

> models::PublicKey enable_key(key_enable_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**key_enable_body** | [**KeyEnableBody**](KeyEnableBody.md) |  | [required] |

### Return type

[**models::PublicKey**](PublicKey.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## find_user

> models::UserResponse find_user(user_sub)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**user_sub** | [**UserSub**](UserSub.md) |  | [required] |

### Return type

[**models::UserResponse**](UserResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_users

> Vec<models::UserResponse> list_users()


### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::UserResponse>**](UserResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## me

> models::UserResponse me()


### Parameters

This endpoint does not need any parameter.

### Return type

[**models::UserResponse**](UserResponse.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## remove_key

> remove_key(key_remove_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**key_remove_body** | [**KeyRemoveBody**](KeyRemoveBody.md) |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## remove_user

> remove_user(user_sub)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**user_sub** | [**UserSub**](UserSub.md) |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

