import { defineStore } from 'pinia'
import { fetch } from './fetch.js'

export const useProductsStore = defineStore('products', () => {
    const page = ref(1)
    const limit = ref(6)
    const maxProducts = ref(0)
    const vehicleClass = ref('')
    const duration = ref('')
    const country = ref('')
    const sort = ref('')
    const sortOrder = ref('')
    const search = ref('')
    const loading = ref(false)

    const cardsRef = ref(null)

    const { data: products, refresh } = fetch(page, limit, maxProducts, vehicleClass, duration, country, sort, sortOrder, search, loading, cardsRef)

    function fetchProducts() {
        loading.value = true
        refresh()
    }

    return {
        page,
        limit,
        maxProducts,
        products,
        vehicleClass,
        duration,
        country,
        sort,
        sortOrder,
        search,
        fetchProducts,
        loading,
        cardsRef
    }
})
