<script setup>
import { ref, onMounted } from "vue"
import router from '../router'
import { visits } from '../state.mjs'


onMounted(async () => {
    const res = await fetch('/api/visit', {
        
    })
})

</script>        
        
<template>

        <div class="search">
            <input
                type="search"
                id="search"
                name="search"
                placeholder="Pas fonctionnel..."
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
                <% if (visites.length === 0) { %>
                    <tr>
                        <td colspan="3" class="empty">Aucune visite enregistrée</td>
                    </tr>
                <% } else { %>
                    <% visites.forEach(visit => { %>
                        <tr>
                            <td><%= new Date(visit.date).toLocaleDateString() %></td>
                            <td><%= visit.company.name %></td>
                            <td><%= visit.inspector.name %></td>
                            <td><a href="/visit_detail/<%= visit.id %>" class="bouton">Afficher</a></td>

                        </tr>
                    <% }) %>
                <% } %>
            </tbody>
        </table>
    </main>

</template>

<style scoped>

</style>