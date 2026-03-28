package com.laundryhub.mobile.api

import com.laundryhub.mobile.models.AuthResponse
import com.laundryhub.mobile.models.LoginRequest
import com.laundryhub.mobile.models.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}