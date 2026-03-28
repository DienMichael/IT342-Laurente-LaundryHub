package com.laundryhub.mobile.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.laundryhub.mobile.databinding.ActivityLoginBinding
import com.laundryhub.mobile.ui.MainActivity
import com.laundryhub.mobile.utils.SessionManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: AuthViewModel by viewModels()
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        sessionManager = SessionManager(this)
        setupListeners()
        observeState()
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val email    = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            if (validateInputs(email, password)) {
                viewModel.login(email, password)
            }
        }
        binding.tvGoToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun validateInputs(email: String, password: String): Boolean {
        var valid = true
        if (email.isEmpty()) {
            binding.tilEmail.error = "Email is required"
            valid = false
        } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "Enter a valid email"
            valid = false
        } else {
            binding.tilEmail.error = null
        }
        if (password.isEmpty()) {
            binding.tilPassword.error = "Password is required"
            valid = false
        } else if (password.length < 6) {
            binding.tilPassword.error = "At least 6 characters"
            valid = false
        } else {
            binding.tilPassword.error = null
        }
        return valid
    }

    private fun observeState() {
        viewModel.authState.observe(this) { state ->
            when (state) {
                is AuthState.Idle    -> setLoading(false)
                is AuthState.Loading -> setLoading(true)
                is AuthState.Success -> {
                    setLoading(false)
                    state.token?.let { token ->
                        lifecycleScope.launch {
                            sessionManager.saveSession(
                                token = token,
                                name  = null,
                                email = binding.etEmail.text.toString().trim(),
                                role  = null
                            )
                        }
                    }
                    navigateToMain()
                }
                is AuthState.Error -> {
                    setLoading(false)
                    Snackbar.make(binding.root, state.message, Snackbar.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun setLoading(loading: Boolean) {
        binding.progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled     = !loading
    }

    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        finish()
    }
}