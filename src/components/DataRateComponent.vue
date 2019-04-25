<template>
    <th :style="{ backgroundColor: `rgba(134, 217, 117, ${rate * 0.2})` }">{{rate * 20}}%</th>
</template>

<script>
export default {
  props: ['rate'],
};
</script>
