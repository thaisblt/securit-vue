<script setup>
import { ref, onMounted, computed } from "vue"
import router from '../router'
import { visits } from '../state.mjs'

// Récupérer la liste des visites 
onMounted(async () => {
    const res = await fetch('/api/visit', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    visits.value = await res.json()
})

// Barre de recherche
const searchInput = ref('')

const filteredVisits = computed( () => {
    if (!searchInput.value) {
        return visits.value
    }

    return visits.value.filter( visit => {
        return visit.company.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        visit.inspector.name.toLowerCase().includes(searchInput.value.toLowerCase())
    })
})

</script>        
        
<template>

        <div class="search">
            <input
                type="search"
                v-model="searchInput"
                placeholder="A tester quand BD remplie"
            />
        </div>


    <main class="page-content">
        <div class="page-header">
            <h2>Visites</h2>
            <a href="/new_visit" class="btn-add">＋ Nouvelle visite</a>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Entreprise</th>
                    <th>Inspecteur</th>
                    <th>Détails</th>                    
                </tr>
            </thead>
            <tbody>
                <template v-if="filteredVisits.length === 0">
                    <tr>
                        <td colspan="4" class="empty">Aucune visite enregistrée</td>
                    </tr>
                </template>

                <template v-else>
                    <tr v-for ="visit in filteredVisits" :key="visit.id">
                            <td>{{ new Date(visit.date).toLocaleDateString() }}></td>
                            <td>{{ visit.company.name }}</td>
                            <td>{{ visit.inspector.name }}</td>
                            <td><a href="/visit_detail/<%= visit.id %>" class="bouton">Afficher</a></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </main>

</template>

<style scoped>

</style>