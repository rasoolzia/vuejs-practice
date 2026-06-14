<script setup lang="ts">
defineOptions({
  name: 'paginationComponent',
});

import type { PaginationProps } from '@/components/types';

interface EnhancedPaginationProps extends PaginationProps {
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<EnhancedPaginationProps>(), {
  maxVisiblePages: 7,
});

// Use defineModel for cleaner v-model support
const currentPage = defineModel<number>('currentPage', { default: 1 });

const emit = defineEmits<{
  (e: 'pageChange', page: number): void;
}>();

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage),
);

// Enhanced pagination logic combining both approaches
const paginationPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const maxVisible = props.maxVisiblePages;

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const delta = Math.floor(maxVisible / 2);

  // Always include first page
  pages.push(1);

  // Calculate range around current page
  let start = Math.max(2, current - delta);
  let end = Math.min(total - 1, current + delta);

  // Adjust range if we're near the beginning or end
  if (current <= delta + 1) {
    end = maxVisible - 1;
  } else if (current >= total - delta) {
    start = total - maxVisible + 2;
  }

  // Add pages in range
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i);
    }
  }

  // Always include last page if there's more than one page
  if (total > 1) {
    pages.push(total);
  }

  return pages.sort((a, b) => a - b);
});

// Check if dots should be shown
const showLeftDots = computed(() => {
  const pages = paginationPages.value;
  return pages.length >= 2 && pages[1] - pages[0] > 1;
});

const showRightDots = computed(() => {
  const pages = paginationPages.value;
  return (
    pages.length >= 2 && pages[pages.length - 1] - pages[pages.length - 2] > 1
  );
});

const isInFirstPage = computed(() => currentPage.value === 1);
const isInLastPage = computed(() => currentPage.value === totalPages.value);

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
  emit('pageChange', page);
}

function handlePageClick(action: 'previous' | 'next' | number) {
  switch (action) {
    case 'previous':
      if (!isInFirstPage.value) goToPage(currentPage.value - 1);
      break;
    case 'next':
      if (!isInLastPage.value) goToPage(currentPage.value + 1);
      break;
    default:
      goToPage(action);
      break;
  }
}

function buttonClasses(isActive: boolean) {
  return [
    'px-3 py-1 rounded-md select-none transition-colors',
    isActive
      ? 'bg-blue-600 dark:bg-blue-500 text-white cursor-not-allowed'
      : 'bg-neutral-100 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer',
  ];
}

// Calculate display range for "Showing X to Y of Z items"
const displayRange = computed(() => {
  const start = Math.min(
    (currentPage.value - 1) * props.itemsPerPage + 1,
    props.totalItems,
  );
  const end = Math.min(
    currentPage.value * props.itemsPerPage,
    props.totalItems,
  );
  return { start, end };
});
</script>

<template>
  <div v-if="totalPages > 1" class="w-full">
    <nav class="flex justify-between items-center p-4">
      <div class="flex gap-2 items-center">
        <!-- Previous button -->
        <button
          :class="buttonClasses(isInFirstPage)"
          :disabled="isInFirstPage"
          @click="handlePageClick('previous')"
          aria-label="Previous page"
        >
          &lt;
        </button>

        <!-- First page -->
        <button
          v-if="paginationPages.includes(1)"
          :class="buttonClasses(currentPage === 1)"
          :disabled="currentPage === 1"
          @click="handlePageClick(1)"
        >
          1
        </button>

        <!-- Left dots -->
        <span
          v-if="showLeftDots"
          class="px-3 py-1 text-gray-900 dark:text-gray-100"
          aria-label="More pages"
        >
          ...
        </span>

        <!-- Middle pages -->
        <template v-for="page in paginationPages" :key="page">
          <button
            v-if="page !== 1 && page !== totalPages"
            :class="buttonClasses(currentPage === page)"
            :disabled="currentPage === page"
            @click="handlePageClick(page)"
          >
            {{ page }}
          </button>
        </template>

        <!-- Right dots -->
        <span
          v-if="showRightDots"
          class="px-3 py-1 text-gray-900 dark:text-gray-100"
          aria-label="More pages"
        >
          ...
        </span>

        <!-- Last page -->
        <button
          v-if="paginationPages.includes(totalPages) && totalPages > 1"
          :class="buttonClasses(currentPage === totalPages)"
          :disabled="currentPage === totalPages"
          @click="handlePageClick(totalPages)"
        >
          {{ totalPages }}
        </button>

        <!-- Next button -->
        <button
          :class="buttonClasses(isInLastPage)"
          :disabled="isInLastPage"
          @click="handlePageClick('next')"
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>

      <!-- Items info -->
      <span class="text-sm text-gray-600 dark:text-gray-300">
        Showing {{ displayRange.start }} to {{ displayRange.end }} of
        {{ totalItems }} items
      </span>
    </nav>
  </div>
</template>
