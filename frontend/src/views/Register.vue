<script setup>
    import { ref } from 'vue'
    import { authEmail } from '../state.mjs'
    import router from '../router'

    const email = ref()
    
    async function handleRegister(){
        const res = await fetch('/api/check_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:email.value }),
        })

        if (res.status === 200){
            authEmail.value = email.value
            router.push('/register_verify')
        }
    }

</script>

<template>
    <div class="login-form">

        <p class="instruction" >
            Création du compte<br>
        </p>

        <label>Email <br>
            <input type="email" placeholder="abc@exemple.com" name="email" v-model="email" required class="champs">
        </label>

        <button type="button" class="bouton" @click="handleRegister">Continuer</button>

        <a href="/" class="alternative">
            <p>Connexion</p>
        </a>

    </div>
</template>

<style scoped>

</style>
