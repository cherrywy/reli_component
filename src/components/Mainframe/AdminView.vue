<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
      <a href="/" class="logo">
        <!-- mini logo for sidebar mini 40x50 pixels -->
        <span class="logo-mini">{{ config.siteNameMini }}</span>
        <!-- logo for regular state and mobile devices -->
        <div class="logo-lg">
          <img src="/static/img/logo.png" alt="Logo" class="img-responsive">
          <span>{{ config.siteName }}</span>
        </div>
      </a>

      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button" @click="triggerWindowResize">
          <span class="sr-only">Toggle navigation</span>
        </a>
      </nav>
    </header>

    <!-- Left side column. contains the logo and sidebar -->
    <Sidebar />

    <!-- Content Wrapper. Contains page content -->
    <Wrapper />
  </div>
  <!-- ./wrapper -->
</template>

<script>
import config from '../../config'
import Sidebar from './../SharedBlocks/Sidebar/Sidebar'
import Wrapper from './../SharedBlocks/Wrapper/WrapperView'

export default {
  name: 'Dash',
  components: {
    Sidebar,
    Wrapper
  },
  data: function () {
    return {
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      config: config
    }
  },
  methods: {
    triggerWindowResize () {
      setTimeout(() => {
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('resize', true, false)
        window.dispatchEvent(evt)
      }, 301) // as long as longer than adminlte's offcanvas transition, 1ms later is enough here
    }
  },

  mounted () {}
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.logo-mini {
  text-align: center;
}

.logo-lg {
  text-align: center;

  img {
    display: inline-block;
    padding-top: .4em;
    width: 35px;
    max-height: 40px;
    vertical-align: top;
  }
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
</style>
