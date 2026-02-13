const CodeEditorNav = () => {

   // this should contain run and submit button and user avatar 
   return (
      <div className="flex items-center justify-between p-4 border-b">
         <h2 className="text-lg font-semibold">Code Editor</h2>
         <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Run Code</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Submit</button>
         </div>
      </div>
   );
}

export default CodeEditorNav;