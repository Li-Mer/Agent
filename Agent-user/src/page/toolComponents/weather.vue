 <template>
  <div style="height: 4px"></div>
  <div class="weather-content">
    <div class="weather-item" v-for="(item, index) in functionData" :key="index">
      <div class="day-time">{{ item.daytime.slice(4).slice(0, 2) }}/{{ item.daytime.slice(4).slice(2) }}</div>
      <div class="day-weather">
        <img :src="item.day_weather_pic" alt="" />
        <p>{{ item.day_weather }}</p>
      </div>
      <div class="temperature">{{ item.night_air_temperature }}~{{ item.day_air_temperature }}°C</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ServerQueryWeatherType } from '@/types';
  defineProps<{
    functionData: ServerQueryWeatherType;
  }>();
</script>

<style scoped lang="less">
.weather-content {
  background: linear-gradient(to bottom left, #2c305b, #6b6f91);
  color: #ffffff;
  border-radius: 4px;
  .weather-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 15px;
    padding: 7px 0;
    .day-time {
      flex: 1;
      text-align: center;
    }
    .day-weather {
      flex: 1;
      display: flex;
      align-items: center;
      p {
        font-size: 15px;
        padding-left: 10px;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .temperature {
      flex: 1;
      text-align: center;
    }
  }
}
</style>