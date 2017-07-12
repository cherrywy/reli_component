<template>
	<section>
			<ul style='list-style:none;'>
				<li @click='tabToggle("tab01");'>Tab001</li>
				<li @click='tabToggle("tab02");'>Tab002</li>
			</ul>
			<component :is='currentView' keep-alive></component>
	</section>
</template>
<script>
	import Vue from 'Vue';
    var tab01 = Vue.extend({
        template: '<p>This is tab01</p>'
    })

	var tab02 = Vue.extend({
		template: '<p>This is tab02</p>'
	})
	export default {
		data: {
			currentView: 'tab01'
		},
		components: {
			tab01: {
				template: '<p>This is tab01</p>'
			},
			tab02:  {
				template: '<p>This is tab02</p>'
			}
		},
		methods: {
			tabToggle: function(tabText) {
				this.currentView = tabText
			}
		}
	}
</script>