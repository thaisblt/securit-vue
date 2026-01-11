<script setup>
    import { ref } from "vue"
    import router from '../router'
    import { authEmail } from '../state.mjs'


    const isError = ref(false)
    const email = ref()
    const password = ref ()
    

    async function handleSignin(){
        const res = await fetch('/api/check_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:authEmail.value, password:password.value }),
        })

        if (res.status === 403){
            isError.value = true
            setTimeout( () => isError.value = false, 10000)
        } else if (res.status === 200) {
            router.push('/login_verify')
        }
    }


</script>

<template>

    <div class="login-form">

        <label>Email <br>
            <input type="email" placeholder="abc@exemple.com" name="email" v-model="authEmail" required class="champs">
        </label>

        <label>Mot de passe <br>
            <input type="password" placeholder="Mot de passe" name="password" v-model="password" class="champs">
        </label>

        <div class="warning" v-if="isError">Mail et/ou mot de passe incorrecte(s)</div>

        <button type="button" class="bouton" @click="handleSignin">Connexion</button>

    </div>

    <a href="/register" class="alternative">
        <p>Créer un compte</p>
    </a>

    <a href="/forgotten_password" class="alternative">
        <p>Mot de passe oublié</p>
    </a>

</template>

<style scoped>

</style>