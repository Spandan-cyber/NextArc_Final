// In auth.js

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS (UPDATE) ---
    const singleSignInBtn = document.getElementById('single-signin-btn-desktop');
    const authOptionsContainer = document.getElementById('auth-options-desktop');
    const googleSignInBtn = document.getElementById('google-signin-btn-desktop');
    const githubSignInBtn = document.getElementById('github-signin-btn-desktop');
    const userProfileDesktop = document.getElementById('user-profile-desktop');
    const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
    const userAvatarDesktop = document.getElementById('user-avatar-desktop');

    const auth = firebase.auth();

    // --- NEW: UI TOGGLE FUNCTIONALITY ---
    if (singleSignInBtn) {
        singleSignInBtn.addEventListener('click', () => {
            // Toggle the display of the options container
            const isVisible = authOptionsContainer.style.display === 'block';
            authOptionsContainer.style.display = isVisible ? 'none' : 'block';
        });
    }

    // --- AUTH PROVIDERS ---
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const githubProvider = new firebase.auth.GithubAuthProvider(); // NEW PROVIDER

    // --- SIGN IN FUNCTIONS ---
    const handleSignIn = async (provider) => {
        try {
            await auth.signInWithPopup(provider);
            // Close options after successful sign-in
            if (authOptionsContainer) authOptionsContainer.style.display = 'none';
        } catch (error) {
            console.error("Sign-in failed:", error);
            alert(`Sign-in failed: ${error.message}`);
        }
    };

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => handleSignIn(googleProvider));
    }
    
    // NEW: GITHUB SIGN-IN LISTENER
    if (githubSignInBtn) {
        githubSignInBtn.addEventListener('click', () => handleSignIn(githubProvider));
    }

    // --- LOGOUT FUNCTIONALITY ---
    if (logoutBtnDesktop) {
        logoutBtnDesktop.addEventListener('click', async () => {
            try {
                await auth.signOut();
            } catch (error) {
                console.error("Logout failed:", error);
            }
        });
    }

    // --- AUTH STATE LISTENER (To manage UI) ---
    auth.onAuthStateChanged(user => {
        const authButtonsContainer = document.getElementById('auth-buttons-desktop');
        
        if (user) {
            // User is signed in: show avatar, hide the sign-in button container
            if (userProfileDesktop) userProfileDesktop.style.display = 'flex';
            if (authButtonsContainer) authButtonsContainer.style.display = 'none';
            if (singleSignInBtn) singleSignInBtn.style.display = 'none'; // Hide main button too
            
            // Set Avatar
            if (userAvatarDesktop) {
                userAvatarDesktop.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`;
            }

        } else {
            // User is signed out: hide avatar, show the sign-in button
            if (userProfileDesktop) userProfileDesktop.style.display = 'none';
            if (authButtonsContainer) authButtonsContainer.style.display = 'flex';
            if (singleSignInBtn) singleSignInBtn.style.display = 'block'; // Show main button
            if (authOptionsContainer) authOptionsContainer.style.display = 'none'; // Ensure options are closed
        }
    });

});