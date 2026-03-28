package com.laundryhub.mobile.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "session")

class SessionManager(private val context: Context) {

    companion object {
        private val TOKEN_KEY      = stringPreferencesKey("auth_token")
        private val USER_NAME_KEY  = stringPreferencesKey("user_name")
        private val USER_EMAIL_KEY = stringPreferencesKey("user_email")
        private val USER_ROLE_KEY  = stringPreferencesKey("user_role")
    }

    val authToken: Flow<String?> = context.dataStore.data.map { it[TOKEN_KEY] }
    val userName: Flow<String?>  = context.dataStore.data.map { it[USER_NAME_KEY] }
    val userRole: Flow<String?>  = context.dataStore.data.map { it[USER_ROLE_KEY] }

    suspend fun saveSession(token: String, name: String?, email: String?, role: String?) {
        context.dataStore.edit { prefs ->
            prefs[TOKEN_KEY] = token
            name?.let  { prefs[USER_NAME_KEY]  = it }
            email?.let { prefs[USER_EMAIL_KEY] = it }
            role?.let  { prefs[USER_ROLE_KEY]  = it }
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { it.clear() }
    }
}