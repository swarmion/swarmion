## Without optimization

```
op run -- pnpm ts-node scripts/analyzeVariance.ts swarmion/swarmion 8bbec52165d0f8fe136d1ddd33bae57f9fbe8b07
Found 21 runs for swarmion/swarmion (8bbec52165d0f8fe136d1ddd33bae57f9fbe8b07)
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────┬───────────────────┬─────────────────────┬────────────┬──────────────────┐
│                                                                       (index)                                                                        │  average   │ standardDeviation │ varianceCoefficient │   range    │ rangeCoefficient │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────┼───────────────────┼─────────────────────┼────────────┼──────────────────┤
│       packages/serverless-contracts/src/contracts/eventBridge/__benches__/bigEventBridgeHandler.bench.ts::EventBridge::big handler::invocation       │ '228.4 µs' │     '10.7 µs'     │       '4.7%'        │ '24.6 µs'  │     '10.8%'      │
│   packages/serverless-contracts/src/contracts/eventBridge/__benches__/bigEventBridgeHandler.bench.ts::EventBridge::big handler::bundled cold start   │  '1.3 s'   │     '37.4 ms'     │       '2.9%'        │  '90 ms'   │      '6.9%'      │
│    packages/serverless-contracts/src/contracts/apiGateway/__benches__/basicHttpApiHandler.bench.ts::ApiGateway::basic handler::bundled cold start    │ '842.9 ms' │     '7.2 ms'      │       '0.9%'        │ '37.1 ms'  │      '4.4%'      │
│   packages/serverless-contracts/src/contracts/apiGateway/__benches__/bigHttpApiHandler.bench.ts::ApiGateway::big handler::basic handler invocation   │ '650.3 µs' │     '1.2 µs'      │       '0.2%'        │  '5.1 µs'  │      '0.8%'      │
│        packages/serverless-contracts/src/contracts/eventBridge/__benches__/basicEventBridge.bench.ts::EventBridge::basic handler::invocation         │ '72.3 µs'  │    '118.9 ns'     │       '0.2%'        │ '475.6 ns' │      '0.7%'      │
│ packages/serverless-contracts/src/contracts/apiGateway/__benches__/basicHttpApiHandler.bench.ts::ApiGateway::basic handler::basic handler invocation │ '305.5 µs' │    '330.2 ns'     │       '0.1%'        │  '1.2 µs'  │      '0.4%'      │
│      packages/serverless-contracts/src/contracts/apiGateway/__benches__/bigHttpApiHandler.bench.ts::ApiGateway::big handler::bundled cold start      │  '2.2 s'   │     '1.8 ms'      │       '0.1%'        │  '8.1 ms'  │      '0.4%'      │
│    packages/serverless-contracts/src/contracts/eventBridge/__benches__/basicEventBridge.bench.ts::EventBridge::basic handler::bundled cold start     │ '690.2 ms' │    '497.3 µs'     │       '0.1%'        │  '1.8 ms'  │      '0.3%'      │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────┴───────────────────┴─────────────────────┴────────────┴──────────────────┘
```

## With optimization

```
op run -- pnpm ts-node scripts/analyzeVariance.ts swarmion/swarmion a96bac23d80cb123c3314016dd0c5e907773a766
Found 21 runs for swarmion/swarmion (a96bac23d80cb123c3314016dd0c5e907773a766)
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────┬───────────────────┬─────────────────────┬────────────┬──────────────────┐
│                                                                       (index)                                                                        │  average   │ standardDeviation │ varianceCoefficient │   range    │ rangeCoefficient │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────┼───────────────────┼─────────────────────┼────────────┼──────────────────┤
│   packages/serverless-contracts/src/contracts/eventBridge/__benches__/bigEventBridgeHandler.bench.ts::EventBridge::big handler::bundled cold start   │  '1.4 s'   │     '70.6 ms'     │       '5.0%'        │ '355.8 ms' │     '25.1%'      │
│       packages/serverless-contracts/src/contracts/eventBridge/__benches__/bigEventBridgeHandler.bench.ts::EventBridge::big handler::invocation       │ '216.9 µs' │     '4.2 µs'      │       '1.9%'        │ '19.5 µs'  │      '9.0%'      │
│    packages/serverless-contracts/src/contracts/apiGateway/__benches__/basicHttpApiHandler.bench.ts::ApiGateway::basic handler::bundled cold start    │ '571.5 ms' │     '7.2 ms'      │       '1.3%'        │ '26.7 ms'  │      '4.7%'      │
│      packages/serverless-contracts/src/contracts/apiGateway/__benches__/bigHttpApiHandler.bench.ts::ApiGateway::big handler::bundled cold start      │  '2.3 s'   │     '9.7 ms'      │       '0.4%'        │ '40.9 ms'  │      '1.8%'      │
│ packages/serverless-contracts/src/contracts/apiGateway/__benches__/basicHttpApiHandler.bench.ts::ApiGateway::basic handler::basic handler invocation │ '305.7 µs' │     '1.1 µs'      │       '0.4%'        │  '5.7 µs'  │      '1.9%'      │
│    packages/serverless-contracts/src/contracts/eventBridge/__benches__/basicEventBridge.bench.ts::EventBridge::basic handler::bundled cold start     │ '462.3 ms' │     '1.2 ms'      │       '0.3%'        │  '3.8 ms'  │      '0.8%'      │
│   packages/serverless-contracts/src/contracts/apiGateway/__benches__/bigHttpApiHandler.bench.ts::ApiGateway::big handler::basic handler invocation   │ '653.3 µs' │     '1.5 µs'      │       '0.2%'        │  '4.8 µs'  │      '0.7%'      │
│        packages/serverless-contracts/src/contracts/eventBridge/__benches__/basicEventBridge.bench.ts::EventBridge::basic handler::invocation         │  '73 µs'   │    '109.4 ns'     │       '0.2%'        │ '361.1 ns' │      '0.5%'      │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────┴───────────────────┴─────────────────────┴────────────┴──────────────────┘
```
