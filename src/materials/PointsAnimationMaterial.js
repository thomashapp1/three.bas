import { ShaderLib } from 'three';
import BaseAnimationMaterial from './BaseAnimationMaterial';

/**
 * Extends THREE.PointsMaterial with custom shader chunks.
 *
 * @param {Object} parameters Object containing material properties and custom shader chunks.
 * @constructor
 */
function PointsAnimationMaterial(parameters) {
  BaseAnimationMaterial.call(this, parameters, ShaderLib['points'].uniforms);

  this.vertexShader = this.concatVertexShader();
  this.fragmentShader = this.concatFragmentShader();
}

PointsAnimationMaterial.prototype = Object.create(BaseAnimationMaterial.prototype);
PointsAnimationMaterial.prototype.constructor = PointsAnimationMaterial;

PointsAnimationMaterial.prototype.concatVertexShader = function () {
  return ShaderLib.points.vertexShader
    .replace(
      'void main() {',
      `
      ${this.stringifyChunk('vertexParameters')}
      ${this.stringifyChunk('varyingParameters')}
      ${this.stringifyChunk('vertexFunctions')}

      void main() {
        ${this.stringifyChunk('vertexInit')}
      `
    )
    .replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>

      ${this.stringifyChunk('vertexPosition')}
      ${this.stringifyChunk('vertexColor')}
      `
    )
    .replace(
      '#include <morphtarget_vertex>',
      `
      #include <morphtarget_vertex>

      ${this.stringifyChunk('vertexPostMorph')}
      `
    )
};

PointsAnimationMaterial.prototype.concatFragmentShader = function () {
  return ShaderLib.points.fragmentShader
    .replace(
      'void main() {',
      `
      ${this.stringifyChunk('fragmentParameters')}
      ${this.stringifyChunk('varyingParameters')}
      ${this.stringifyChunk('fragmentFunctions')}

      void main() {
        ${this.stringifyChunk('fragmentInit')}
      `
    )
    .replace(
      '#include <map_fragment>',
      `
      ${this.stringifyChunk('fragmentDiffuse')}
      ${(this.stringifyChunk('fragmentMap') || '#include <map_fragment>')}

      `
    )
    .replace(
      '#include <premultiplied_alpha_fragment>',
      `
      ${this.stringifyChunk('fragmentShape')}

      #include <premultiplied_alpha_fragment>
      `
    )
};

export { PointsAnimationMaterial };
