import RollupPluginCommonjs from '@rollup/plugin-commonjs'
import RollupPluginJson from '@rollup/plugin-json'
import RollupPluginNodeResolve from '@rollup/plugin-node-resolve'
import Path from 'path'
import RollupPluginDelete from 'rollup-plugin-delete'
import RollupPluginTypescript from 'rollup-plugin-typescript2'
import PackageJson from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(PackageJson.dependencies || {}),
    plugins: [
      RollupPluginDelete({
        targets: './dist/*',
        watch: true
      }),
      RollupPluginNodeResolve(),
      RollupPluginCommonjs(),
      RollupPluginJson(),
      RollupPluginTypescript()
    ],
    output: {
      file: PackageJson.main
    }
  },
  {
    input: 'src/index.ts',
    plugins: [RollupPluginNodeResolve(), RollupPluginCommonjs(), RollupPluginJson(), RollupPluginTypescript()],
    output: {
      file: PackageJson.browser,
      format: 'iife',
      name: 'name' // todo CONFIG
    }
  }
]
