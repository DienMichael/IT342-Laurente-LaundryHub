package com.laundryhub.mobile.models

import com.google.gson.annotations.SerializedName

data class RegisterRequest(
    @SerializedName("name")     val name: String,
    @SerializedName("email")    val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("role")     val role: String = "CUSTOMER"
)

data class LoginRequest(
    @SerializedName("email")    val email: String,
    @SerializedName("password") val password: String
)

data class AuthResponse(
    @SerializedName("message") val message: String? = null,
    @SerializedName("token")   val token: String? = null,
    @SerializedName("user")    val user: UserDto? = null,
    @SerializedName("error")   val error: String? = null
)

data class UserDto(
    @SerializedName("id")    val id: Long? = null,
    @SerializedName("name")  val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("role")  val role: String? = null
)