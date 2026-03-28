package com.laundryhub.mobile.ui.auth

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.laundryhub.mobile.databinding.ActivityRegisterBinding

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val viewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupListeners()
        observeState()
    }

    private fun setupListeners() {
        binding.btnRegister.setOnClickListener {
            val name     = binding.etName.text.toString().trim()
            val email    = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val confirm  = binding.etConfirmPassword.text.toString().trim()
            val role     = if (binding.rbStaff.isChecked) "STAFF" else "CUSTOMER"

            if (validateInputs(name, email, password, confirm)) {
                viewModel.register(name, email, password, role)
            }
        }
        binding.tvGoToLogin.setOnClickListener { finish() }
    }

    private fun validateInputs(
        name: String, email: String,
        password: String, confirm: String
    ): Boolean {
        var valid = true
        if (name.isEmpty()) {
            binding.tilName.error = "Name is required"
            valid = false
        } else {
            binding.tilName.error = null
        }
        if (email.isEmpty()) {
            binding.tilEmail.error = "Email is required"
            valid = false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
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
        if (confirm != password) {
            binding.tilConfirmPassword.error = "Passwords do not match"
            valid = false
        } else {
            binding.tilConfirmPassword.error = null
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
                    Snackbar.make(
                        binding.root,
                        "Registration successful!",
                        Snackbar.LENGTH_LONG
                    ).show()
                    startActivity(Intent(this, LoginActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                    })
                    finish()
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
        binding.btnRegister.isEnabled  = !loading
    }
}