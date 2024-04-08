import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { UploadStartBody, UploadStartResponse, TokenAddBody, TokenResponse, User } from './models';

export type UploadData = {
        Start: {
                    requestBody: UploadStartBody
                    
                };
Chunk: {
                    file: unknown
                    
                };
    }

export type TokenData = {
        Add: {
                    requestBody: TokenAddBody
                    
                };
Remove: {
                    tokenId: number
                    
                };
    }

export class UploadService {

	/**
	 * @returns UploadStartResponse Ok
	 * @throws ApiError
	 */
	public static start(data: UploadData['Start']): CancelablePromise<UploadStartResponse> {
		const {
                        
                        requestBody
                    } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/upload/start',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns void No content
	 * @throws ApiError
	 */
	public static chunk(data: UploadData['Chunk']): CancelablePromise<void> {
		const {
                        
                        file
                    } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/upload/chunk',
			formData: {
				file
			},
		});
	}

}

export class TokenService {

	/**
	 * @returns User Ok
	 * @throws ApiError
	 */
	public static info(): CancelablePromise<User> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/token/info',
		});
	}

	/**
	 * @returns TokenResponse Ok
	 * @throws ApiError
	 */
	public static add(data: TokenData['Add']): CancelablePromise<TokenResponse> {
		const {
                        
                        requestBody
                    } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/token/add',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns TokenResponse Ok
	 * @throws ApiError
	 */
	public static list(): CancelablePromise<Array<TokenResponse>> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/token/list',
		});
	}

	/**
	 * @returns void No content
	 * @throws ApiError
	 */
	public static remove(data: TokenData['Remove']): CancelablePromise<void> {
		const {
                        
                        tokenId
                    } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/token/remove/{tokenId}',
			path: {
				tokenId
			},
		});
	}

}