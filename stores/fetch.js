export function fetch(page, limit, maxProducts, vehicleClass, duration, country, sort, sortOrder, search, loading) {
    loading.value = true

    return useFetch('http://localhost:4000/products', {
        query: computed(() => ({
            _page: page.value,
            _limit: limit.value,
            ...(vehicleClass.value ? { vehicle: vehicleClass.value } : {}),
            ...(duration.value ? { duration: duration.value } : {}),
            ...(country.value ? { country: country.value } : {}),
            ...(sortOrder.value ? { _sort: "price", _order: sortOrder.value } : {}),
            ...(search.value ? { q: search.value.trim() } : {}),

        })),
        onResponse({ response }) {
            maxProducts.value = Number(response.headers.get('x-total-count') || 0)
            loading.value = false
        },
        watch: [page, limit, vehicleClass, duration, country, sort, sortOrder, search, loading]
    })
}
