# \FilesystemApi

All URIs are relative to */api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**add_directory**](FilesystemApi.md#add_directory) | **POST** /fs/directory/add | 
[**add_members**](FilesystemApi.md#add_members) | **POST** /fs/{mnemonic}/member/add | 
[**duplicate_inode**](FilesystemApi.md#duplicate_inode) | **POST** /fs/{mnemonic}/duplicate | 
[**file_info**](FilesystemApi.md#file_info) | **GET** /fs/{mnemonic}/file | 
[**inode_tree**](FilesystemApi.md#inode_tree) | **GET** /fs/{mnemonic}/tree | 
[**list_files**](FilesystemApi.md#list_files) | **GET** /fs/{mnemonic}/file/list | 
[**list_home**](FilesystemApi.md#list_home) | **GET** /fs/list | 
[**list_inodes**](FilesystemApi.md#list_inodes) | **GET** /fs/{mnemonic}/list | 
[**list_parents**](FilesystemApi.md#list_parents) | **GET** /fs/{mnemonic}/parent/list | 
[**move_inode**](FilesystemApi.md#move_inode) | **POST** /fs/move | 
[**remove_inode**](FilesystemApi.md#remove_inode) | **POST** /fs/{mnemonic}/remove | 
[**search_cancel**](FilesystemApi.md#search_cancel) | **POST** /fs/search/{jobId}/cancel | 
[**search_fs**](FilesystemApi.md#search_fs) | **POST** /fs/search | 
[**search_results**](FilesystemApi.md#search_results) | **POST** /fs/search/{jobId} | 



## add_directory

> models::Directory add_directory(add_directory_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**add_directory_body** | [**AddDirectoryBody**](AddDirectoryBody.md) |  | [required] |

### Return type

[**models::Directory**](Directory.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## add_members

> add_members(mnemonic, member_add_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |
**member_add_body** | [**MemberAddBody**](MemberAddBody.md) |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## duplicate_inode

> models::Inode duplicate_inode(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**models::Inode**](Inode.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## file_info

> models::FileDownload file_info(mnemonic)


Get all the file information required to download a single file

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**models::FileDownload**](FileDownload.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## inode_tree

> models::InodeTree inode_tree(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**models::InodeTree**](InodeTree.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_files

> Vec<models::FileKeys> list_files(mnemonic)


Recursively list all files in a directory

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**Vec<models::FileKeys>**](FileKeys.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_home

> models::ListResponse list_home()


### Parameters

This endpoint does not need any parameter.

### Return type

[**models::ListResponse**](ListResponse.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_inodes

> models::ListResponse list_inodes(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**models::ListResponse**](ListResponse.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_parents

> Vec<models::InodeMembers> list_parents(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

[**Vec<models::InodeMembers>**](InodeMembers.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## move_inode

> move_inode(move_inode_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**move_inode_body** | [**MoveInodeBody**](MoveInodeBody.md) |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## remove_inode

> remove_inode(mnemonic)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**mnemonic** | **String** |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## search_cancel

> search_cancel(job_id)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**job_id** | **String** |  | [required] |

### Return type

 (empty response body)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## search_fs

> models::SearchFs200Response search_fs(inode_search_body)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**inode_search_body** | [**InodeSearchBody**](InodeSearchBody.md) |  | [required] |

### Return type

[**models::SearchFs200Response**](searchFs_200_response.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## search_results

> models::InodeSearchResults search_results(job_id)


### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**job_id** | **String** |  | [required] |

### Return type

[**models::InodeSearchResults**](InodeSearchResults.md)

### Authorization

[api_key](../README.md#api_key), [jwt](../README.md#jwt)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

