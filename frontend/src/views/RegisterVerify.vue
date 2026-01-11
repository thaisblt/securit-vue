<script setup>
    import { ref } from "vue"
    import router from '../router'
    import { authEmail } from '../state.mjs'



    const code = ref()
    const codeError = ref(false)
    
    async function handleCode(){
        const res = await fetch('/api/check_register_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:authEmail.value, code:code.value }),
        })
        if (res.status === 200) {
            console.log("Code valide : -> set_name_password")
            router.push('/set_name_password')
        
        } else if (res.status === 403){
            codeError.value = true
            setTimeout( () => codeError.value = false, 10000)
        }
    }
</script>

<template>
    <div class="login-form">

        <p class="instruction" >
            Vérifiez votre boite mail et tapez le code de confirmation<br>
        </p>

        <label>Code de confirmation <br>
            <input type="text" placeholder="ex : 1234" name="code" v-model="code" required class="champs">
        </label>

        <div class="warning" v-if="codeError">Code de confirmation incorrecte</div>

        <button type="button" class="bouton" @click="handleCode">Continuer</button>

        <a href="/" class="alternative">
            <p>Connexion</p>
        </a>

    </div>
</template>

<style scoped>

</style>
