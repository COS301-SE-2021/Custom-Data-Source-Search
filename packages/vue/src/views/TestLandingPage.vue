<template>
    <LandingPageElement></LandingPageElement>
</template>

<script>
    // @ is an alias to /src
    import LandingPageElement from "../components/LandingPageElement";

    export default {
        name: 'Test',
        components: {
            LandingPageElement,
        },
        data(){
            return {
                msg: "Trying out landing page design"
            }
        }
    }
</script>