<template>
    <div>
      <FormKit type="text" name="name" label="Property Name" validation="required" />
      <FormKit
        type="select"
        name="property_type"
        label="Property Type"
        :options="[
          'apartment', 'house', 'condo', 'townhouse', 'commercial'
        ]"
        validation="required"
      />
      <FormKit type="textarea" name="description" label="Description" />
    </div>
  </template>
  