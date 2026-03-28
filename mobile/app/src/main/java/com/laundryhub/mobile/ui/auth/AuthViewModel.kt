package com.laundryhub.mobile.ui.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.laundryhub.mobile.api.RetrofitClient
import com.laundryhub.mobile.models.LoginRequest
import com.laundryhub.mobile.models.RegisterRequest
import kotlinx.coroutines.launch

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val message: String, val token: String?) : AuthState()
    data class Error(val message: String) : AuthState()
}

class AuthViewModel : ViewModel() {

    private val _authState = MutableLiveData<AuthState>(AuthState.Idle)
    val authState: LiveData<AuthState> = _authState

    fun register(name: String, email: String, password: String, role: String = "CUSTOMER") {
        _authState.value = AuthState.Loading
        viewModelScope.launch {
            try {
                val response = RetrofitClient.authService.register(
                    RegisterRequest(name, email, password, role)
                )
                if (response.isSuccessful) {
                    val body = response.body()
                    _authState.value = AuthState.Success(
                        message = body?.message ?: "Registration successful!",
                        token   = body?.token
                    )
                } else {
                    val errMsg = response.errorBody()?.string()
                        ?.takeIf { it.isNotBlank() }
                        ?: "Registration failed (${response.code()})"
                    _authState.value = AuthState.Error(errMsg)
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Error(
                    "Network error: ${e.localizedMessage ?: "Check your connection."}"
                )
            }
        }
    }

    fun login(email: String, password: String) {
        _authState.value = AuthState.Loading
        viewModelScope.launch {
            try {
                val response = RetrofitClient.authService.login(
                    LoginRequest(email, password)
                )
                if (response.isSuccessful) {
                    val body = response.body()
                    _authState.value = AuthState.Success(
                        message = body?.message ?: "Login successful!",
                        token   = body?.token
                    )
                } else {
                    val errMsg = when (response.code()) {
                        401  -> "Invalid email or password."
                        404  -> "Account not found."
                        else -> response.errorBody()?.string()
                            ?.takeIf { it.isNotBlank() }
                            ?: "Login failed (${response.code()})"
                    }
                    _authState.value = AuthState.Error(errMsg)
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Error(
                    "Network error: ${e.localizedMessage ?: "Check your connection."}"
                )
            }
        }
    }

    fun resetState() {
        _authState.value = AuthState.Idle
    }
}