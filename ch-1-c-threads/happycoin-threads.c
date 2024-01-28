#include <inttypes.h> // access to integer types
#include <stdbool.h>  // boolean logic?
#include <stdio.h>    // I/O functions
#include <stdlib.h>   // idk
#include <time.h>     // measuring time
#include <pthread.h>  // threading support
#define THREAD_COUNT 4

struct happy_result
{
  size_t count;
  uint64_t *nums;
};

uint64_t random64(uint32_t *seed)
{
  // init an unsigned 64 bit integer
  uint64_t result;
  // create a pointer inside of result
  uint8_t *result8 = (uint8_t *)&result;
  // loop and generate random numbers to fill the 64 bit integer
  for (size_t i = 0; i < sizeof(result); i++)
  {
    result8[i] = rand_r(seed);
  }
  return result;
}

uint64_t sum_digits_squared(uint64_t num)
{
  uint64_t total = 0;
  while (num > 0)
  {
    // get each digit from right to left
    uint64_t num_mod_base = num % 10;
    // square it and assign to total
    total += num_mod_base * num_mod_base;
    // lop off the rightmost digit
    num = num / 10;
  }
  return total;
}

bool is_happy(uint64_t num)
{
  // repeatedly call sum_digits_squared until we get to a 1 (happy number) or 4 (infinite loop)
  while (num != 1 && num != 4)
  {
    num = sum_digits_squared(num);
  }
  return num == 1;
}

bool is_happycoin(uint64_t num)
{
  // function to do the work and check if the coin is happy and divisible by 10000
  return is_happy(num) && num % 10000 == 0;
}

void *get_happycoins(void *arg)
{
  // cast the arg to an int instead of void
  int attempts = *(int *)arg;
  // set limit
  int limit = attempts / 10000;
  // set seed same way as non-threaded
  uint32_t seed = time(NULL);
  // allocate memory space for array and struct happy_result
  uint64_t *nums = malloc(limit * sizeof(uint64_t));
  struct happy_result *result = malloc(sizeof(struct happy_result));
  result->nums = nums;
  result->count = 0;
  for (int i = 1; i < attempts; i++)
  {
    if (result->count == limit)
    {
      break;
    }
    uint64_t random_num = random64(&seed);
    if (is_happycoin(random_num))
    {
      result->nums[result->count++] = random_num;
    }
  }
  free(nums); // experimental freeing of memory
  return (void *)result;
};

int main()
{
  pthread_t thread[THREAD_COUNT];
  int attempts = 10000000 / THREAD_COUNT;
  int count = 0;
  for (int i = 0; i < THREAD_COUNT; i++)
  {
    pthread_create(&thread[i], NULL, get_happycoins, &attempts);
  };
  for (int j = 0; j < THREAD_COUNT; j++)
  {
    struct happy_result *result;
    pthread_join(thread[j], (void **)&result);
    count += result->count;
    for (int k = 0; k < result->count; k++)
    {
      printf("%" PRIu64 " ", result->nums[k]);
    }
  }
  printf("\ncount %d\n", count);
  return 0;
}