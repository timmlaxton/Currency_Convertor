import Vue from 'vue';

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: "#app",
    data: {
      rates: null,
      base: "GBP",
      baseInput: 0,
      selectedCurrency: "EUR",
      allCountries: null,
      currencySymbol: null
    },
    computed: {
      converted: function() {
        const result = this.baseInput * this.rates[this.selectedCurrency];
        return this.currencySymbol + result.toFixed(2);
      },

    },
    mounted() {
      this.fetchCurrencyData();
      this.fetchAllCountries();
    },
    methods: {
      fetchCurrencyData: function() {
        const request = fetch(`https://api.exchangeratesapi.io/latest?base=${this.base}`)
        .then(response => response.json())
        .then(data => {
          this.rates = data.rates;
          if (data.base === "EUR") { this.rates["EUR"] = 1 };
          this.base = data.base;
        })
      },
      swapCurrencies: function() {
        if (this.selectedCurrency && this.base) {
          [this.selectedCurrency, this.base] = [this.base, this.selectedCurrency];
        this.fetchCurrencyData();
        this.fetchCurrencySymbol();
        }
      },
      updateCurrencies: function() {
        this.fetchCurrencyData();
        this.fetchCurrencySymbol();
      },
      fetchAllCountries: function() {
        let request = fetch('https://restcountries.eu/rest/v2/all')
        .then(response => response.json())
        .then(data => { this.allCountries = data; this.fetchCurrencySymbol() })
      },
      fetchCurrencySymbol: function() {
        const result = this.allCountries.filter(country => country.currencies[0].code === this.selectedCurrency);
        this.currencySymbol = result[0].currencies[0].symbol.toUpperCase();
      }
    }
  })
})
