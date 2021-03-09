function create(type, content, cl){
    var el = document.createElement(type)
    el.innerHTML = content;
    if(typeof cl !== 'undefined')
       el.classList.add(cl);
    return el;
 }

 function get_select_text(id){
    let el = document.querySelector(id);
    let text = el.options[el.selectedIndex].text;
    return text;
 }

 function get_int(str){
    return parseInt(str, 10);
 }

 function is_access_supported_by_stage(access, stage){
    if(access == "0")
       return true;
    if(["VK_PIPELINE_STAGE_ALL_GRAPHICS_BIT", "VK_PIPELINE_STAGE_ALL_COMMANDS_BIT"].includes(stage))
       return true;
    else if(access == "VK_ACCESS_INDIRECT_COMMAND_READ_BIT"){
       return ["VK_PIPELINE_STAGE_DRAW_INDIRECT_BIT", "VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_INDEX_READ_BIT"){
       return ["VK_PIPELINE_STAGE_VERTEX_INPUT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_VERTEX_ATTRIBUTE_READ_BIT"){
       return ["VK_PIPELINE_STAGE_VERTEX_INPUT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_UNIFORM_READ_BIT"){
       return ["VK_PIPELINE_STAGE_TASK_SHADER_BIT_NV", "VK_PIPELINE_STAGE_MESH_SHADER_BIT_NV", "VK_PIPELINE_STAGE_RAY_TRACING_SHADER_BIT_KHR", "VK_PIPELINE_STAGE_VERTEX_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_CONTROL_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_EVALUATION_SHADER_BIT", "VK_PIPELINE_STAGE_GEOMETRY_SHADER_BIT", "VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT", "VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_SHADER_READ_BIT"){
       return ["VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR", "VK_PIPELINE_STAGE_TASK_SHADER_BIT_NV", "VK_PIPELINE_STAGE_MESH_SHADER_BIT_NV", "VK_PIPELINE_STAGE_RAY_TRACING_SHADER_BIT_KHR", "VK_PIPELINE_STAGE_VERTEX_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_CONTROL_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_EVALUATION_SHADER_BIT", "VK_PIPELINE_STAGE_GEOMETRY_SHADER_BIT", "VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT", "VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_SHADER_WRITE_BIT"){
       return ["VK_PIPELINE_STAGE_TASK_SHADER_BIT_NV", "VK_PIPELINE_STAGE_MESH_SHADER_BIT_NV", "VK_PIPELINE_STAGE_RAY_TRACING_SHADER_BIT_KHR", "VK_PIPELINE_STAGE_VERTEX_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_CONTROL_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_EVALUATION_SHADER_BIT", "VK_PIPELINE_STAGE_GEOMETRY_SHADER_BIT", "VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT", "VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_INPUT_ATTACHMENT_READ_BIT"){
       return ["VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_COLOR_ATTACHMENT_READ_BIT"){
       return ["VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT"){
       return ["VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT"){
       return ["VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT", "VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT"){
       return ["VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT", "VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_TRANSFER_READ_BIT"){
       return ["VK_PIPELINE_STAGE_TRANSFER_BIT", "VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_TRANSFER_WRITE_BIT"){
       return ["VK_PIPELINE_STAGE_TRANSFER_BIT", "VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_HOST_READ_BIT"){
       return ["VK_PIPELINE_STAGE_HOST_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_HOST_WRITE_BIT"){
       return ["VK_PIPELINE_STAGE_HOST_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_MEMORY_READ_BIT"){
       return true;
    }
    else if(access == "VK_ACCESS_MEMORY_WRITE_BIT"){
       return true;
    }
    else if(access == "VK_ACCESS_COLOR_ATTACHMENT_READ_NONCOHERENT_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_COMMAND_PREPROCESS_READ_BIT_NV"){
       return ["VK_PIPELINE_STAGE_COMMAND_PREPROCESS_BIT_NV"].includes(stage);
    }
    else if(access == "VK_ACCESS_COMMAND_PREPROCESS_WRITE_BIT_NV"){
       return ["VK_PIPELINE_STAGE_COMMAND_PREPROCESS_BIT_NV"].includes(stage);
    }
    else if(access == "VK_ACCESS_CONDITIONAL_RENDERING_READ_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_CONDITIONAL_RENDERING_BIT_EXT"].includes(stage);
    }
    else if(access == "VK_ACCESS_FRAGMENT_SHADING_RATE_ATTACHMENT_READ_BIT_KHR"){
       return ["VK_PIPELINE_STAGE_FRAGMENT_SHADING_RATE_ATTACHMENT_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_TRANSFORM_FEEDBACK_WRITE_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_TRANSFORM_FEEDBACK_BIT_EXT"].includes(stage);
    }
    else if(access == "VK_ACCESS_TRANSFORM_FEEDBACK_COUNTER_WRITE_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_TRANSFORM_FEEDBACK_BIT_EXT"].includes(stage);
    }
    else if(access == "VK_ACCESS_TRANSFORM_FEEDBACK_COUNTER_READ_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_TRANSFORM_FEEDBACK_BIT_EXT", "VK_PIPELINE_STAGE_DRAW_INDIRECT_BIT"].includes(stage);
    }
    else if(access == "VK_ACCESS_ACCELERATION_STRUCTURE_READ_BIT_KHR"){
       return ["VK_PIPELINE_STAGE_TASK_SHADER_BIT_NV", "VK_PIPELINE_STAGE_TESSELLATION_CONTROL_SHADER_BIT", "VK_PIPELINE_STAGE_TESSELLATION_EVALUATION_SHADER_BIT", "VK_PIPELINE_STAGE_GEOMETRY_SHADER_BIT", "VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT", "VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT", "VK_PIPELINE_STAGE_RAY_TRACING_SHADER_BIT_KHR", "VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_ACCELERATION_STRUCTURE_WRITE_BIT_KHR"){
       return ["VK_PIPELINE_STAGE_ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
    }
    else if(access == "VK_ACCESS_FRAGMENT_DENSITY_MAP_READ_BIT_EXT"){
       return ["VK_PIPELINE_STAGE_FRAGMENT_DENSITY_PROCESS_BIT_EXT"].includes(stage);
    }
    return false;
 }


 function get_error_txt(){
    if(get_select_text('#srcSubpass') == "VK_SUBPASS_EXTERNAL" && get_select_text('#dstSubpass') == "VK_SUBPASS_EXTERNAL"){
       return "<code>srcSubpass</code> and <code>dstSubpass</code> must not both be equal to <code>VK_SUBPASS_EXTERNAL</code>.";
    }

    // srcSubpass must be less than or equal to dstSubpass
    if(get_select_text('#srcSubpass') !== "VK_SUBPASS_EXTERNAL" && get_select_text('#srcSubpass') !== "VK_SUBPASS_EXTERNAL")
    {
       if(get_int(get_select_text('#srcSubpass')) > get_int(get_select_text('#dstSubpass'))){
          return "<code>srcSubpass</code> must be less than or equal to <code>dstSubpass</code>, unless one of them is <code>VK_SUBPASS_EXTERNAL</code>, to avoid cyclic dependencies and ensure a valid execution order";
       }
    }

    // Table 4 fulfilled?
    // let full_first_scope = get_select_text('#srcStageMask') == "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT";
    // let full_second_scope = get_select_text('#dstStageMask') == "VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT";
    if(!is_access_supported_by_stage(get_select_text('#srcAccessMask'), get_select_text('#srcStageMask'))){
       return "Any access flag included in <code>srcAccessMask</code> must be supported by one of the pipeline stages in <code>srcStageMask</code>, as specified in <a href=\"https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#synchronization-access-types-supported\">table of supported access types</a>";
    }
    if(!is_access_supported_by_stage(get_select_text('#dstAccessMask'), get_select_text('#dstStageMask'))){
       return "Any access flag included in <code>dstAccessMask</code> must be supported by one of the pipeline stages in <code>dstStageMask</code>, as specified in the <a href=\"https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#synchronization-access-types-supported\">table of supported access types</a>";
    }

    // Memory access with TOP/BOTTOM
    {
       let wrong_for_src = get_select_text('#srcAccessMask') !== "0" && is_stage_mask_pipe_end("#srcStageMask");
       let wrong_for_dst = get_select_text('#dstAccessMask') !== "0" && is_stage_mask_pipe_end("#dstStageMask");
       if(wrong_for_src || wrong_for_dst){
          return "Defining a memory access != 0 with a TOP/BOTTOM_OF_PIPE stage mask. That is legal, but probably a mistake since those stages don't perform memory access.";
       }
    }

    return undefined;
 }


 function is_stage_mask_pipe_end(stage_mask_id){
    let stage_mask = get_select_text(stage_mask_id);
    return ["VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT", "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT"].includes(stage_mask);
 }

 function is_dep_on_read(){
    return get_select_text("#srcAccessMask").includes("_READ_BIT");
 }


 function f0(){
    var result_el = document.querySelector('#result');
    result_el.innerHTML = '';
    
    var error_txt = get_error_txt();
    if(typeof error_txt != "undefined"){
       let error_el = create("p", error_txt, "error");
       result_el.appendChild(error_el);
       return;
    }

    // "Creates dependency between A and B"
    result_el.appendChild(create("span", "Creates a dependency between"));
    let ul = document.createElement('ul')
    if (get_select_text('#srcSubpass') === "VK_SUBPASS_EXTERNAL")
       ul.appendChild(create("li", "Commands that occur earlier in submission order than the <code>vkCmdBeginRenderPass</code> used to begin the render pass instance and"));
    else
       ul.appendChild(create("li", "Subpass " + get_select_text("#srcSubpass") +" and"));

    if (get_select_text('#dstSubpass') === "VK_SUBPASS_EXTERNAL")
       ul.appendChild(create("li", "Commands that occur later in submission order than the  <code>vkCmdEndRenderPass</code> used to end the render pass instance."));
    else
       ul.appendChild(create("li", "Subpass " + get_select_text("#dstSubpass")));
    result_el.appendChild(ul);
    
    // srcSubpass == dstSubpass
    if(get_select_text('#srcSubpass') == get_select_text('#dstSubpass')){
       result_el.appendChild(create("p", "This is a subpass self-dependency. About this, @marttyfication has a few words:"));
       result_el.appendChild(create("blockquote", "you probably don't want a subpass self dep, fix your validation error by not barriering inside renderpasses 😛. it was a half joke. you need it sometimes (framebuffer feedback) but it is niche. the problem is when people barrier inside the render pass, the validation layer tells them that can only be done with a self-dep."));
    }

    // Memory or execution dependency?
    let is_exec_dependency = get_select_text('#srcAccessMask') == "0" && get_select_text('#dstAccessMask') == "0";
    if(is_exec_dependency){
       result_el.appendChild(create("p", "Both access masks are zero. That means no visibility or availability operations are generated. That means this is only an execution dependency."));
    }

    let no_first_scope = get_select_text('#srcStageMask') == "VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT";
    let full_first_scope = get_select_text('#srcStageMask') == "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT";
    let full_second_scope = get_select_text('#dstStageMask') == "VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT";
    let no_second_scope = get_select_text('#dstStageMask') == "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT";
    if(no_first_scope){
       result_el.appendChild(create("p", "<code>srcStageMask=VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT</code> includes no pipeline stages in first synchronization scope => this waits for nothing (not necessarily bad, just FYI)"));
    }
    if(full_first_scope){
       result_el.appendChild(create("p", "<code>srcStageMask=VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT</code> includes all pipeline stages as first synchronization scope"));
    }
    if(no_second_scope){
       result_el.appendChild(create("p", "<code>dstStageMask=VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT</code> includes no pipeline stages in second synchronization scope"));
    }
    if(full_second_scope){
       result_el.appendChild(create("p", "<code>dstStageMask=VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT</code> includes all pipeline stages as second synchronization scope"));
    }
    if(no_first_scope && no_second_scope){
       result_el.appendChild(create("p", "This doesn't do anything. If you just want to explicitly override the implicit dependency, good for you! If you expect this to do something, you're probably wrong (or I am)"));
    }

    if(!is_exec_dependency){
       let source_scope = "<code>" + get_select_text('#srcStageMask') + " × " + get_select_text('#srcAccessMask') + "</code>";
       if(get_select_text('#srcAccessMask') == "0")
          source_scope = "Actually nothing because <code>srcAccessMask=0</code>";

       let destination_scope = "<code>" + get_select_text('#dstStageMask') + " × " + get_select_text('#dstAccessMask') + "</code>";
       if(get_select_text('#dstAccessMask') == "0")
          destination_scope = "Actually nothing because <code>dstAccessMask=0</code>";

       result_el.appendChild(create("p", "This creates a memory dependency that will make everything in the source scope available, and everything available (including layout transitions because \"writes performed by a layout transition are automatically made available\") visible in the destination scope."));

       ul = document.createElement('ul')
       ul.appendChild(create("li", "Source Scope: " + source_scope));
       ul.appendChild(create("li", "Destination Scope: " + destination_scope));
       result_el.appendChild(ul);
       

       if(is_dep_on_read()){
          result_el.appendChild(create("p", "<code>srcAccessMask</code> is a READ, that makes no sense and is probably a mistake."));
       }
    }
 }

 // function example_

 
 document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#srcSubpass').addEventListener("change", f0);
    document.querySelector('#dstSubpass').addEventListener("change", f0);
    document.querySelector('#srcStageMask').addEventListener("change", f0);
    document.querySelector('#dstStageMask').addEventListener("change", f0);
    document.querySelector('#srcAccessMask').addEventListener("change", f0);
    document.querySelector('#dstAccessMask').addEventListener("change", f0);
    f0();
 });
 