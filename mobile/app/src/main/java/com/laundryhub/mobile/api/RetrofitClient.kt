package com.laundryhub.mobile.api

// If this remains red after the steps below, Alt+Enter on it to import
import com.laundryhub.mobile.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    // Fixed: Initialized directly to avoid the property delegate error
    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.BASE_URL) // This points to your http://10.0.2.2:8080/
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val authService: AuthApiService by lazy {
        retrofit.create(AuthApiService::class.java)
    }
}