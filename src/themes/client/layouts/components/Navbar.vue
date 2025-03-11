<template>
    <div class="w-full z-40" :class="{ dark: store.semidark }">
        <div class="shadow-sm">
            <div class="bg-white flex w-full items-center px-5 py-2.5 dark:bg-RecurPay">
                <div class="flex-none horizontal-logo flex justify-between items-center">
                    <a href="../" class="main-logo flex items-center">
                        <img class="w-8" src="/assets/images/logo.png" alt="logo" />
					</a>
                </div>
				<div class="grow flex flex-col">
					<slot name="center"></slot>
				</div>
				<div class="flex-none">
					<slot name="right"></slot>
				</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index"
const store = useAppStore()
</script>