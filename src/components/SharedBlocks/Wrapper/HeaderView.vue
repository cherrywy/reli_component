<template>
  <section class="content-header">
    <TitleView></TitleView>
    <ControlsView></ControlsView>
    <!--<ol class="breadcrumb">
      <li><a href="javascript:;"><i class="fa fa-home"></i>首页</a></li>
      <li class="active">{{$route.name.toUpperCase()}}</li>
    </ol>-->
    <div class="clearfix"></div>
    <hr>
  </section>
</template>

<script>
import TitleView from './HeaderPiece/TitleView'
import ControlsView from './HeaderPiece/ControlsView'

export default {
  components: {
    TitleView,
    ControlsView
  }
}
</script>

<style scoped>

</style>
