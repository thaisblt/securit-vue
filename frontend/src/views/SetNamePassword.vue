<script setup>
    import { ref } from "vue"
    import router from '../router'
    import { authEmail } from '../state.mjs'

    const passwordError = ref(false)
    const name = ref()
    const password1 = ref()
    const password2 = ref()
    
    async function registration(){
        const res = await fetch('/api/check_name_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:authEmail.value, name:name.value, password1:password1.value, password2:password2.value }),
        })
        if (res.status === 200) {
            console.log("Inscription ok  : -> vers login")
            router.push('/')
        
        } else if (res.status === 403){
            passwordError.value = true
            setTimeout( () => passwordError.value = false, 10000)
        }
    }
</script>        
        
<template>

    <div class="login-form">
        <p class="info_affichee" >
            {{ authEmail}}<br>
        </p>

        <p class="instruction" >
            Entrez votre nom et choisissez votre mot de passe<br>
        </p>

            <label>Nom <br>
                <input type="text" name="name" v-model="name" placeholder="Votre nom" required class="champs">
            </label>
            
            <label>Mot de passe <br>
                <input type="password" name="password1" v-model="password1" placeholder="*************" required class="champs">
            </label>

            <label>Mot de passe (confirmer)<br>
                <input type="password" name="password2" v-model="password2" placeholder="*************" required class="champs">
            </label>

            <div class="warning" v-if="passwordError">Les mots de passe sont différents</div>

            <button type="button" class="bouton" @click="registration">Continuer</button>

    </div>
</template>

<style scoped>

</style>